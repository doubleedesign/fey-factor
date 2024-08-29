/**
 * Utility to process a file of simple TypeScript type/interface definitions
 * and generate matching GraphQL typedefs
 */
import ts, { TypeLiteralNode } from 'typescript';
import chalk from 'chalk';
import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { tables } from '../src/generated/source-types';
import { DatabaseConnection } from '../src/datasources/database';
import { ForeignKey } from 'pg-to-ts/dist/schemaInterfaces';
import { dbTableNameFormatToTypeFormat, pascalCase, toPlural, typeFormatToDbTableNameFormat } from './utils';
import difference from 'lodash/difference';
const db = new DatabaseConnection();

// The type of object we'll be collecting the processed types into for later processing into GraphQL type definition template literals
type TypeObject = {
	fields: {
		fieldName: string,
		fieldType: any,
		required: boolean,
	}[];
	isSubtypeOf?: string;
	isInterface?: boolean;
	isGqlEntity?: boolean;
};

// The type of object we'll be collecting the processed table types into to enable lookup of table names and their data type names as strings
type TableTypeObject = {
	tableName: string;
	dataType: string;
};

const typesDestFile = './src/generated/typeDefs.graphql';
const queryDestFile = './src/generated/queryType.graphql';
const typeObjects: { [key: string]: TypeObject } = {};
const tableTypes: TableTypeObject[] = [];

export async function generateSchemaTypedefs(file: string) {
	// Create or empty the GraphQL typeDefs file
	writeFileSync(typesDestFile, '', 'utf8');

	// Get the content of the TypeScript types file
	const fileContent = readFileSync(file, 'utf-8');
	const sourceFile = ts.createSourceFile(
		'source-types.ts',
		fileContent,
		ts.ScriptTarget.Latest,
		true
	);

	const extraTypesFile = ts.createSourceFile(
		'types.ts',
		readFileSync('./src/types.ts', 'utf-8'),
		ts.ScriptTarget.Latest,
		true
	);

	try {
		await collectExportedTypes(sourceFile);
		await collectExportedTypes(extraTypesFile);
		detectSubtypes();
		await addForeignKeyFields();
		convertAndSaveTypes();
		createAndSaveQueryType();
	}
	catch (error) {
		console.error(chalk.red(`Error generating GraphQL type definitions: ${error.message}`));
		console.log(error.stack);
	}
}

/**
 * Recursively process the TypeScript AST (Abstract Syntax Tree) to find exported interfaces
 * (note: pg-to-ts generates interfaces, not types, so my manually-defined types are done the same way for simplicity here)
 * @param node - the current node in the AST
 */
async function collectExportedTypes(node: ts.Node): Promise<void> {
	const childPromises: Promise<void>[] = [];

	if (ts.isInterfaceDeclaration(node)) {
		// Ignore the input types
		if (node.name.text.includes('Input')) return;

		// Process the TableTypes interface for later use to handle foreign key fields
		if (node.name.text === 'TableTypes') {
			processTableTypes(node);
		}
		else {
			const isExported = node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
			if (isExported) {
				childPromises.push(processExportedType(node));
			}
		}
	}

	ts.forEachChild(node, childNode => {
		childPromises.push(collectExportedTypes(childNode));
	});

	// Wait for all child nodes to be processed
	await Promise.all(childPromises);
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
async function processExportedType(node: ts.InterfaceDeclaration) {
	if (ts.isInterfaceDeclaration(node)) {
		const fields = node.members.map(field => {
			if (ts.isPropertySignature(field) && field.name) {
				const fieldName = (field.name as ts.Identifier).text;
				const fieldType = field.type ? field.type.getText() : 'unknown';
				const optional = !!field.questionToken || fieldType.includes('null');
				const required = !optional;

				return {
					fieldName,
					fieldType: fieldType.replace('| null', '').trim(),
					required
				};
			}
		});
		const glueKey = await db.getGlueKey(typeFormatToDbTableNameFormat(node.name.text));

		// Create a GQL type object for the type with the same name
		// (this will have more fields added to it according to the table's foreign keys, in another function)
		typeObjects[node.name.text] = {
			fields: fields,
			// If this table has a glue key, it will not be a standalone GraphQL type
			// (Big assumption based on my current use case; may need to change in the future)
			isGqlEntity: !Boolean(glueKey),
		};
	}
}


/**
 * Loop through the typeObjects and determine if any types are subtypes of other types
 * (pg-to-ts doesn't generate inheritance relationships, but we can infer them rather than run an SQL query here)
 * Note: We can't do this in the previous step because we need all types to be available to be checked against
 */
function detectSubtypes() {
	const knownToSkip = ['Role'];

	Object.entries(typeObjects).forEach(([typeName, data]) => {
		const fieldNames = data.fields.map(field => field.fieldName);
		Object.entries(typeObjects).forEach(([otherTypeName, otherTypeData]) => {
			if(typeName === otherTypeName) return; // skip self-comparison
			if(knownToSkip.includes(typeName) || knownToSkip.includes(otherTypeName)) return; // skip known non-parent types that coincidentally match

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
 * so this is all based on linking up entities connected through the Connections table; but in theory it should work for any foreign keys,
 * possibly just with some minor adjustments elsewhere such as defining "glue" fields
 */
async function addForeignKeyFields() {
	for (const table of Object.values(tables)) {
		if(!table.foreignKeys || Object.keys(table.foreignKeys).length === 0) continue; // No foreign keys? Get outta here

		// The data type of the current table, as a string
		const tableDataType = tableTypes.find(type => type.tableName === table.tableName)?.dataType;
		// The glue key in the current table, if there is one
		const glueKey = await db.getGlueKey(table.tableName);
		const glueTypeName = dbTableNameFormatToTypeFormat(table.foreignKeys[(glueKey as string)].table);
		// The foreign keys in the current table, as generated by pg-to-ts, but without the glue key
		const foreignKeys = Object.fromEntries(Object.entries(table.foreignKeys).filter(([key, fk]) => key !== glueKey));

		Object.entries(foreignKeys).forEach(([key, fk]) => {
			const foreignKeyFieldName = fk.table;
			const foreignKeyFieldType = tableTypes.find(type => type.tableName === foreignKeyFieldName)?.dataType;
			const subtypes = Object.keys(typeObjects).filter(name => typeObjects[name].isSubtypeOf === foreignKeyFieldType);

			// Connect up the non-glue foreign key types to each other so {Type} objects can be directly queried
			// This is based entirely on the Connections table, which has People, Works, and Roles
			// The purpose of this is to add works and roles fields to People, people to Works, etc.
			// so you can, for example, query a Person and get all their Works without having to go through Connections and process those
			Object.values(foreignKeys).forEach((otherKeyObject: ForeignKey) => {
				if(otherKeyObject.table === foreignKeyFieldName) return; // skip self-comparison
				if(typeObjects[foreignKeyFieldType].fields.find(field => field.fieldName === otherKeyObject.table)) return; // skip if it already exists

				typeObjects[foreignKeyFieldType].fields.push({
					fieldName: otherKeyObject.table,
					fieldType: `${tableTypes.find(type => type.tableName === otherKeyObject.table).dataType}[]`,
					required: false,
				});

				// Add the glue field to the fields it sticks together
				if(glueKey) {
					typeObjects[foreignKeyFieldType].fields.push({
						fieldName: typeFormatToDbTableNameFormat(glueTypeName),
						fieldType: `${glueTypeName}[]`,
						required: false
					});
				}
			});

			// If this type is a supertype, also add the other foreign key fields to the subtypes
			subtypes.length > 0 && subtypes.forEach(subtype => {
				Object.values(foreignKeys).forEach((otherKeyObject) => {
					if (otherKeyObject.table === foreignKeyFieldName) return; // skip self-comparison
					if (typeObjects[subtype].fields.find(field => field.fieldName === otherKeyObject.table)) return; // skip if it already exists
					typeObjects[subtype].fields.push({
						fieldName: otherKeyObject.table,
						fieldType: `${tableTypes.find(type => type.tableName === otherKeyObject.table).dataType}[]`,
						required: false
					});
				});

				// And the glue field
				typeObjects[subtype].fields.push({
					fieldName: typeFormatToDbTableNameFormat(glueTypeName),
					fieldType: `${glueTypeName}[]`,
					required: false
				});
			});
		});

		if(glueKey) {
			// The fields in this table that are not foreign keys or the primary key: add them to the glue field's type
			// For example, this will add episode_count (from connections) to Role, because role_id is the glue key of connections
			const fieldsToAdd = difference(table.columns, Object.keys(table.foreignKeys), [table.primaryKey]);
			typeObjects[glueTypeName].fields.push(
				...fieldsToAdd.map(fieldName => ({
					fieldName,
					fieldType: typeObjects[tableDataType].fields.find(field => field.fieldName === fieldName)?.fieldType || 'unknown',
					required: false
				}))
			);
		}
	}
}


/**
 * Convert the TypeScript types to GraphQL schema type definitions and save them to the file
 */
function convertAndSaveTypes() {
	// Save the raw types object to a file that the docs can use
	writeFileSync('./src/generated/typeObjects.json', JSON.stringify(typeObjects, null, 2), 'utf8');
	console.log(chalk.green('Successfully saved type objects to JSON file'));

	const rootTypes = Object.entries(typeObjects).filter(([, data]) => !data.isSubtypeOf);
	const subTypes = Object.entries(typeObjects).filter(([, data]) => data.isSubtypeOf);
	const interfaces = Object.entries(typeObjects).filter(([, data]) => data.isInterface).map(([name]) => name);

	// Add filter inputs for interfaces
	interfaces.forEach((name) => {
		const stringParts = [];
		stringParts.push(`input ${name}Filter {`);
		stringParts.push('\ttype: String');
		stringParts.push('}');
		const finalString = stringParts.join('\n').concat('\n');
		appendFileSync(typesDestFile, finalString);
	});

	// Process the root types
	rootTypes.forEach(([name, data]) => {
		if(!data.isGqlEntity) return;

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
		if(!data.isGqlEntity) return;

		const stringParts = [];
		// Open the declaration - this is where it matters that it's a subtype
		stringParts.push(`type ${name} implements ${data.isSubtypeOf} {`);

		// Loop through the fields and add them in the correct format for GraphQL
		stringParts.push(...processFields(data.fields.filter(field => field.fieldName !== 'connections')));

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
			const gqlFieldType = convertTsFieldTypeToGql({ fieldType, required });
			const typeName = dbTableNameFormatToTypeFormat(fieldName);
			if(interfaces.includes(typeName)) {
				stringParts.push(`\t${fieldName}(filter: ${typeName}Filter): ${gqlFieldType}`);
			}
			else if(fieldName === 'id' || fieldName === 'ID') {
				stringParts.push(`\t${fieldName}: ID!`);
			}
			else {
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
	function convertTsFieldTypeToGql({ fieldType, required }: { fieldType: string, required: boolean }) {
		// Handle arrays - convert from Type[] to [Type] (or [Type]! for required fields)
		if(fieldType.includes('[]')) {
			const innerType = fieldType.replace('[]', '');

			return required ? `[${innerType}!]!` : `[${innerType}]`;
		}

		switch(fieldType) {
			case 'string':
				return required ? 'String!' : 'String';
			// TODO: Account for
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
	let queryObject = 'type Query {\n';
	const queryableTypes = Object.keys(typeObjects).filter(type => type !== 'Connection');
	const types = queryableTypes.map(type => {
		return {
			queryType: type,
			returnType: type
		};
	});
	types.forEach(({ queryType, returnType }) => {
		// Singular query
		queryObject += `\t${queryType}(id: ID!): ${returnType}\n`;
		// Plural type - fetch multiple items
		queryObject += `\t${pascalCase(toPlural(queryType))}(ids: [ID], limit: Int): [${returnType}]\n`;
	});
	queryObject += '}';

	writeFileSync(queryDestFile, queryObject, 'utf8');
	console.log(chalk.green(`Successfully generated GraphQL Query definition in ${queryDestFile}`));
}

