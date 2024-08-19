/**
 * Utility to process a file of simple TypeScript type/interface definitions
 * and generate matching GraphQL typedefs
 */
import ts, { TypeLiteralNode } from 'typescript';
import chalk from 'chalk';
import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { tables } from '../src/generated/types';

// The type of object we'll be collecting the processed types into for later processing into GraphQL type definition template literals
type TypeObject = {
	fields: { fieldName: string, fieldType: any, required: boolean }[];
	isSubtypeOf?: string;
	isInterface?: boolean;
}

// The type of object we'll be collecting the processed table types into to enable lookup of table names and their data type names as strings
type TableTypeObject = {
	tableName: string;
	dataType: string;
}

const typesDestFile = './src/generated/typeDefs.graphql';
const queryDestFile = './src/generated/queryType.graphql';
const typeObjects: { [key: string]: TypeObject } = {};
const tableTypes: TableTypeObject[] = [];

export function generateSchemaTypedefs(file: string) {
	// Create or empty the GraphQL typeDefs file
	writeFileSync(typesDestFile, '', 'utf8');

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
		createAndSaveQueryType();
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
 * Loop through the tables object and match up tables' foreign key fields to the types to their types and add fields accordingly
 * Note: At the time of writing, only the Connections table has foreign keys (TvShows and Movies are linked to Works through inheritance)
 * so this is all based on linking up entities connected through the Connections table; but in theory it should work for any foreign keys
 */
function addForeignKeyFields() {
	Object.values(tables).forEach(table => {
		if(!table.foreignKeys || Object.keys(table.foreignKeys).length === 0) return; // No foreign keys? Get outta here

		// The data type of the current table, as a string
		const tableDataType = tableTypes.find(type => type.tableName === table.tableName)?.dataType;
		// The foreign keys in the current table, as generated by pg-to-ts
		const foreignKeys = table.foreignKeys;

		Object.entries(foreignKeys).forEach(([key, fk]) => {
			const foreignKeyFieldName = fk.table;
			const foreignKeyFieldType = tableTypes.find(type => type.tableName === foreignKeyFieldName).dataType;
			const subtypes = Object.keys(typeObjects).filter(name => typeObjects[name].isSubtypeOf === foreignKeyFieldType);

			// For this table's type, add a field for the foreign key's type
			// e.g., connections table (data type Connection) has a foreign key person_id which maps to the People table (Person type)
			// so the Connection type should get a field person: Person
			typeObjects[tableDataType].fields.push({
				// eslint-disable-next-line max-len
				fieldName: key.replace('_id', ''), // using this instead of fk.table because they're things like "person_id" not "people" where I want "person"
				fieldType: foreignKeyFieldType,
				required: false
			});

			// For the foreign key's type, add a field for an array of the current table's type
			// e.g., connections table (data type Connection) has a foreign key person_id which maps to the People table (Person type)
			// so the Person type should get a field connections: Connection[]
			typeObjects[foreignKeyFieldType].fields.push({
				fieldName: table.tableName,
				fieldType: `${tableDataType}[]`,
				required: false
			});

			// Match up the types of all the foreign keys to each other so whole objects can be directly queried
			// This is based entirely on the Connections table, which has People, Works, and Roles
			// The purpose of this is to add works and roles fields to People, people and roles fields to Works, etc.
			// so you can, for example, query a Person and get all their Works without having to go through Connections
			Object.values(foreignKeys).forEach((otherKeyObject) => {
				if(otherKeyObject.table === foreignKeyFieldName) return; // skip self-comparison
				typeObjects[foreignKeyFieldType].fields.push({
					fieldName: otherKeyObject.table,
					fieldType: `${tableTypes.find(type => type.tableName === otherKeyObject.table).dataType}[]`,
					required: false
				});
			});

			// If this type is a supertype, also add the other foreign key fields to the subtypes
			subtypes.length > 0 && subtypes.forEach(subtype => {
				// Add the field for the current table
				// e.g., this will add connections: Connection[] to the Movie and TvShow types which are subtypes of Work
				typeObjects[subtype].fields.push({
					fieldName: table.tableName,
					fieldType: `${tableDataType}[]`,
					required: false
				});

				// Add the other foreign key fields
				// e.g., Work has subtypes of Movie and TvShow which I want to have a people field
				Object.values(foreignKeys).forEach((otherKeyObject) => {
					if(otherKeyObject.table === foreignKeyFieldName) return; // skip self-comparison
					typeObjects[subtype].fields.push({
						fieldName: otherKeyObject.table,
						fieldType: `${tableTypes.find(type => type.tableName === otherKeyObject.table).dataType}[]`,
						required: false
					});
				});
			});
		});
	});
}


/**
 * Convert the TypeScript types to GraphQL schema type definitions and save them to the file
 */
function convertAndSaveTypes() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const rootTypes = Object.entries(typeObjects).filter(([_, data]) => !data.isSubtypeOf);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		appendFileSync(typesDestFile, finalString);
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
		appendFileSync(typesDestFile, finalString);
	});


	/**
	 * Inner function (for DRY reasons) to process the fields of a type (it doesn't matter here whether it's a root type or subtype)
	 * @param fields
	 */
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

	/**
	 * Inner function to convert a TypeScript field type to a GraphQL field type
	 * @param fieldType
	 * @param required
	 */
	function convertTsFieldTypeToGql({ fieldType, required }: {fieldType: string, required: boolean}) {
		// Handle arrays - convert from Type[] to [Type] (or [Type]! for required fields)
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

	console.log(chalk.green(`Successfully generated GraphQL type definitions in ${typesDestFile}`));
}

/**
 * Create and save the Query type to a separate file
 */
function createAndSaveQueryType() {
	let queryType = 'type Query {\n';
	const typeNames = Object.keys(typeObjects);
	typeNames.forEach(typeName => {
		queryType += `\t${typeName.toLowerCase()}(id: ID!): ${typeName}\n`;
	});
	queryType += '}';

	writeFileSync(queryDestFile, queryType, 'utf8');
	console.log(chalk.green(`Successfully generated GraphQL Query definition in ${queryDestFile}`));
}


