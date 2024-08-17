/**
 * Utility to process a file of simple TypeScript type/interface definitions
 * and generate matching GraphQL typedefs
 */
import ts, { TypeLiteralNode } from 'typescript';
import chalk from 'chalk';
import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { tables } from '../src/generated/types';

type TypeObject = {
	fields: { fieldName: string, fieldType: any, required: boolean }[];
	isSubtypeOf?: string;
	isInterface?: boolean;
}

const destFile = './src/generated/typeDefs.graphql';
const typeObjects: { [key: string]: TypeObject } = {};
const tableTypes = [];

export function generateTypeDefs(file: string) {
	// Create or empty the GraphQL typeDefs file
	writeFileSync(destFile, '', 'utf8');

	// Get the content of the TypeScript types file
	const fileContent = readFileSync(file, 'utf-8');
	const sourceFile = ts.createSourceFile(
		'types.ts',
		fileContent,
		ts.ScriptTarget.Latest,
		true
	);

	try {
		collectExportedTypes(sourceFile);
		detectSubtypes();
		addForeignKeyFields();
		convertAndSaveTypes();
		console.log(chalk.green(`Successfully generated GraphQL type definitions in ${destFile}`));
	}
	catch(error) {
		console.error(chalk.red(`Error generating GraphQL type definitions: ${error.message}`));
	}
}

/**
 * Recursively process the TypeScript AST (Abstract Syntax Tree) to find exported interfaces
 * (pg-to-ts generates interfaces, not types, so that's all we need to handle)
 * @param node - the current node in the AST
 */
function collectExportedTypes(node: ts.Node) {
	if(ts.isInterfaceDeclaration(node)) {
		// Ignore the input types
		if(node.name.text.includes('Input')) return;

		// Process the TableTypes interface for later use to handle foreign key fields
		if(node.name.text === 'TableTypes') {
			processTableTypes(node);
		}
		// Process all other exported types, which are expected to be the entities we want like Person, Work, Role
		else {
			const isExported = node.modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
			if (isExported) {
				processExportedType(node);
			}
		}
	}

	ts.forEachChild(node, collectExportedTypes);
}


/**
 * Process the TableTypes interface to get the table names and the name of the type of data they hold as a string
 * @param node
 */
function processTableTypes(node: ts.InterfaceDeclaration) {
	node.members.forEach(member => {
		if(ts.isPropertySignature(member)) {
			const tableName = (member.name as ts.Identifier).text;
			const column: Partial<ts.PropertySignature> = (member.type as TypeLiteralNode).members.find((member: ts.PropertySignature) => {
				const columnName = (member.name as ts.Identifier).text;
				return columnName === 'select';
			}) as ts.PropertySignature;

			const columnDataType = column.type ? column.type.getText() : 'unknown';

			tableTypes.push({ tableName, dataType: columnDataType });
		}
	});
}


/**
 * Process an exported interface and add it to the typeObjects object
 * @param node - AST node representing the exported interface
 */
function processExportedType(node: ts.TypeAliasDeclaration | ts.InterfaceDeclaration) {
	if (ts.isInterfaceDeclaration(node)) {
		typeObjects[node.name.text] = {
			fields: [
				...node.members.map(field => {
					if (ts.isPropertySignature(field) && field.name) {
						const fieldName = (field.name as ts.Identifier).text;
						const fieldType = field.type ? field.type.getText() : 'unknown';
						const optional = !!field.questionToken || fieldType.includes('null');
						const required = !optional;
						return {
							fieldName,
							fieldType: fieldType.replace('| null', '').trim(),
							required };
					}
				})
			]
		};
	}
}


/**
 * Loop through the typeObjects and determine if any types are subtypes of other types
 * (pg-to-ts doesn't generate inheritance relationships, so we have to infer them)
 * Note: We can't do this in the previous step because we need all types to be available to be checked against
 */
function detectSubtypes() {
	const knownToSkip = ['Role'];

	Object.entries(typeObjects).forEach(([typeName, data]) => {
		const fieldNames = data.fields.map(field => field.fieldName);
		Object.entries(typeObjects).forEach(([otherTypeName, otherTypeData]) => {
			if(typeName === otherTypeName) return; // skip self-comparison
			if(knownToSkip.includes(typeName) || knownToSkip.includes(otherTypeName)) return; // skip known non-parent roles

			const otherFieldNames = otherTypeData.fields.map(field => field.fieldName);
			// If the type being checked has all the fields of the other type, it is a subtype
			if(fieldNames.every(fieldName => otherFieldNames.includes(fieldName))) {
				typeObjects[otherTypeName].isSubtypeOf = typeName;
				typeObjects[typeName].isInterface = true;
			}
		});
	});
}


/**
 * Loop through the tables object and match up tables' foreign key fields to the types to their types
 * and add fields to those types accordingly
 * e.g., The connections table has a foreign key field person_id that references the people table,
 * so the Person type should have a connections field that returns an array of Connection objects
 */
function addForeignKeyFields() {
	Object.values(tables).forEach(table => {
		if(!table.foreignKeys || Object.keys(table.foreignKeys).length === 0) return; // No foreign keys? Get out of here now

		const tableName = table.tableName;
		const tableDataType = tableTypes.find(type => type.tableName === tableName)?.dataType;
		const foreignKeys = table.foreignKeys;

		// For each foreign key in this table, find the types that it references and add a field to this type of them
		// e.g., connections table (data type Connection) has foreign keys for person_id, work_id, and role_id,
		// but I want the entire Person, Work, and Role objects to be able to be queried from the Connection type
		// TODO: Should this be improved to have subtypes and group connections? e.g., when querying a Person, each Work would only appear once and multiple roles would be grouped
		const thisType = tableTypes.find(type => type.tableName === tableName).dataType;
		Object.entries(foreignKeys).forEach(([key, fk]) => {
			typeObjects[thisType].fields.push({
				// eslint-disable-next-line max-len
				fieldName: key.replace('_id', ''), // using this instead of fk.table because they're things like "person_id" not "people" where I want "person"
				fieldType: `${tableTypes.find(type => type.tableName === fk.table).dataType}`,
				required: false
			});
		});

		// For each foreign key, find the corresponding type(s) and add a field to it for an array of the foreign key's type
		// e.g., connections table (data type Connection) has a foreign key person_id which maps to the People table (Person type)
		// so the Person type should get a field connections: Connection[]
		Object.values(foreignKeys).forEach(fk => {
			const typeToAddTo = tableTypes.find(type => type.tableName === fk.table).dataType;
			typeObjects[typeToAddTo].fields.push({
				fieldName: tableName,
				fieldType: `${tableDataType}[]`,
				required: false
			});

			// Also add to any subtypes of this type
			// eslint-disable-next-line max-len
			const subtypesToAddTo = Object.entries(typeObjects).filter(([_, data]) => data.isSubtypeOf === typeToAddTo).map(([name, _]) => name);
			subtypesToAddTo.forEach(subtype => {
				typeObjects[subtype].fields.push({
					fieldName: tableName,
					fieldType: `${tableDataType}[]`,
					required: false
				});
			});
		});
	});
}


/**
 * Convert the TypeScript types to GraphQL schema type definitions and save them to the file
 */
function convertAndSaveTypes() {
	const rootTypes = Object.entries(typeObjects).filter(([_, data]) => !data.isSubtypeOf);
	const subTypes = Object.entries(typeObjects).filter(([_, data]) => data.isSubtypeOf);

	// Process the root types first
	rootTypes.forEach(([name, data]) => {
		const stringParts = [];
		// Open the declaration; interface = has subtypes; type = standalone concrete type
		data.isInterface ? stringParts.push(`interface ${name} {`) : stringParts.push(`type ${name} {`);

		// Loop through the fields and add them in the correct format for GraphQL
		stringParts.push(...processFields(data.fields));

		// Close the declaration
		stringParts.push('}');
		// Convert to a formatted string
		const finalString = stringParts.join('\n').concat('\n');

		// Write to file
		appendFileSync(destFile, finalString);
	});

	// Then the subtypes that implement some of them
	subTypes.forEach(([name, data]) => {
		const stringParts = [];
		// Open the declaration - this is where it matters that it's a subtype
		stringParts.push(`type ${name} implements ${data.isSubtypeOf} {`);

		// Loop through the fields and add them in the correct format for GraphQL
		stringParts.push(...processFields(data.fields));

		// Close the declaration
		stringParts.push('}');
		// Convert to a formatted string
		const finalString = stringParts.join('\n').concat('\n');

		// Write to file
		appendFileSync(destFile, finalString);
	});

	// Inner function to process the fields of a type (it doesn't matter here whether it's a root type or subtype)
	function processFields(fields: TypeObject['fields']) {
		const stringParts = [];
		fields.forEach(({ fieldName, fieldType, required }) => {
			if(fieldName === 'id' || fieldName === 'ID') {
				stringParts.push(`\t${fieldName}: ID!`);
			}
			else {
				const gqlFieldType = convertTsFieldTypeToGql({ fieldType, required });
				stringParts.push(`\t${fieldName}: ${gqlFieldType}`);
			}
		});

		return stringParts;
	}
}


/**
 * Convert a TypeScript field type to a GraphQL field type
 * @param fieldType
 * @param required
 */
function convertTsFieldTypeToGql({ fieldType, required }: {fieldType: string, required: boolean}) {
	if(fieldType.includes('[]')) {
		const innerType = fieldType.replace('[]', '');
		return required ? `[${innerType}!]!` : `[${innerType}]`;
	}

	switch(fieldType) {
		case 'string':
			return required ? 'String!' : 'String';
		case 'number':
			return required ? 'Int!' : 'Int';
		case 'boolean':
			return required ? 'Boolean!' : 'Boolean';
		default:
			return required ? `${fieldType}!` : fieldType;
	}
}
