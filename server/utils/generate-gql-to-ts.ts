import { exec } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import ts, { TypeLiteralNode } from 'typescript';
import chalk from 'chalk';

const scalarObject: Record<string, object> = {};
const typeStrings: string[] = [];

export async function generateGqlToTs(mainFilePath: string, reformattedFilePath: string) {
	await runGqlCodegen(mainFilePath);
	await reformatGeneratedTypes(mainFilePath, reformattedFilePath);
}


/**
 * Run the graphql-codegen command to generate the GraphQL schema -> TypeScript types
 * @param file
 */
async function runGqlCodegen(file: string) {
	return new Promise((resolve, reject) => {
		exec('npx graphql-codegen --config utils/codegen.yml', (error, stdout, stderr) => {
			if (error || stderr) {
				console.log(chalk.red(error || stderr));
				reject(error || stderr);
			}

			console.log(chalk.green(`Successfully generated GraphQL schema -> TypeScript types in ${file}`));
			resolve(stdout);
		});
	});
}


/**
 * The generated file is still a bit shit, e.g., Maybe<Type> instead of ?: everywhere,
 * referencing the scalars object instead of just putting the type directly in,
 * but at this stage I wonder if I'll need that when implementing queries from the front-end or not,
 * so I'm keeping that file and creating a "fixed" copy with my preferred, simpler formatting
 * @param sourceFile
 * @param destFile
 */
async function reformatGeneratedTypes(sourceFile: string, destFile: string) {
	// Create or empty the destination file
	writeFileSync(destFile, '', 'utf8');

	// Get the content of the GraphQL Codegen-generated types file
	const fileContent = readFileSync(sourceFile, 'utf-8');
	const sourceFileContent = ts.createSourceFile(
		'types.ts',
		fileContent,
		ts.ScriptTarget.Latest,
		true
	);

	processExportedTypes(sourceFileContent);

	writeFileSync(destFile, typeStrings.join('\n'));
}

function processExportedTypes(node: ts.Node) {

	if (ts.isTypeAliasDeclaration(node)) {
		// Skip known input types
		if (['WorkFilter', 'PersonWorksArgs'].includes(node.name.text)) return;

		// Skip irrelevant internal types
		if (['Maybe', 'Make', 'Incremental', 'Exact', 'InputMaybe'].some(str => node.name.text.includes(str))) return;

		// Create a reference object for the Scalars type
		if (ts.isTypeLiteralNode(node.type) && node.name.text === 'Scalars') {
			node.type.members.forEach(member => {
				if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
					const key = member.name.text;
					let value = {};
					if (ts.isTypeLiteralNode(member.type)) {
						member.type.members.forEach(subMember => {
							if (ts.isPropertySignature(subMember) && ts.isIdentifier(subMember.name)) {
								value = {
									[`${subMember.name.getText()}`]: subMember.type.getText()
								};
							}
						});
					}

					scalarObject[key] = value;
				}
			});
		}
		// Process and format the other types
		else if (ts.isTypeLiteralNode(node.type)) {
			const typeLiteral = node.type as TypeLiteralNode;
			let thisTypeString = `export type ${node.name.text} = {\n`;
			typeLiteral.members.forEach(member => {
				if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
					const key = member.name.text;
					const value = convertValue(member.type.getText());
					const operator = member.type.getText().includes('Maybe') ? '?:' : ':';
					thisTypeString += (`${key}${operator} ${value};\n`);
				}
			});
			thisTypeString += '};\n';
			typeStrings.push(thisTypeString);
		}
	}

	ts.forEachChild(node, processExportedTypes);
}


function convertValue(value: string) {
	const stripped = value.replaceAll(/Maybe<(.+)>/g, '$1');
	if(stripped.startsWith('InputScalars')) return null;

	if(stripped.startsWith('Scalars')) {
		const rawType = stripped.replace('Scalars[\'', '').replace('\'][\'output\']', '');

		// @ts-expect-error TS2339: Property output does not exist on type object. It does exist on THIS object.
		return scalarObject[rawType].output;
	}

	if(stripped.includes('Maybe')) {
		const innerType = stripped.replace('Maybe<', '').replace('>', '');
		if(innerType.includes('Array')) {
			const innerInnerType = innerType.replace('Array<', '').replace('>', '');

			return `${convertValue(innerInnerType)}[]`;
		}

		return `${convertValue(innerType)}`;
	}

	if(stripped.includes('Array')) {
		const innerInnerType = stripped.replace('Array<', '').replace('>', '');

		return `${convertValue(innerInnerType)}[]`;
	}

	return stripped;
}