/**
 * Utility to process a file of simple TypeScript type/interface definitions
 * and generate matching GraphQL typedefs
 */
import ts from 'typescript';
import chalk from 'chalk';
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';

const destFile = './src/generated/typeDefs.graphql';

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
		handleExportedTypes(sourceFile);
		console.log(chalk.green(`Successfully generated GraphQL type definitions in ${destFile}`));
	}
	catch(error) {
		console.error(chalk.red(`Error generating GraphQL type definitions: ${error.message}`));
	}
}

function handleExportedTypes(node: ts.Node) {

	if(ts.isInterfaceDeclaration(node)) { // pg-to-ts generates interfaces, not types, so that's all we need to handle
		const isExported = node.modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
		if(isExported) {
			processExportedType(node);
		}
	}

	ts.forEachChild(node, handleExportedTypes);
}

function processExportedType(node: ts.TypeAliasDeclaration | ts.InterfaceDeclaration) {
	if(node.name.text.includes('Input') || node.name.text === 'TableTypes') return;
	const stringParts = [];

	if (ts.isInterfaceDeclaration(node)) { // pg-to-ts generates interfaces, not types, so that's all we need to handle
		// Open the declaration
		stringParts.push(`type ${node.name.text} {`);

		// Loop through the fields and add them in the correct format for GraphQL
		node.members.forEach(field => {
			if (ts.isPropertySignature(field) && field.name) {
				const fieldName = (field.name as ts.Identifier).text;
				if(fieldName === 'id' || fieldName === 'ID') {
					stringParts.push(`\t${fieldName}: ID!`);
				}
				else {
					const tsFieldType = field.type ? field.type.getText() : 'unknown';
					const optional = !!field.questionToken || tsFieldType.includes('null');
					const gqlFieldType = convertTsFieldTypeToGql({ fieldType: tsFieldType, required: !optional });
					stringParts.push(`\t${fieldName}: ${gqlFieldType}`);
				}
			}
		});

		// Close the declaration
		stringParts.push('}');
		// Convert to a formatted string
		const finalString = stringParts.join('\n').concat('\n');

		// Write to file
		appendFileSync(destFile, finalString);
	}
}

function convertTsFieldTypeToGql({ fieldType, required }: {fieldType: string, required: boolean}) {
	switch(fieldType) {
		case 'string':
			return required ? 'String!' : 'String';
		case 'number':
			return required ? 'Int!' : 'Int';
		case 'boolean':
			return required ? 'Boolean!' : 'Boolean';
		default:
			return 'String';
	}
}