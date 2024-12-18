import readline from 'readline';
import chalk from 'chalk';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, visit } from 'graphql';
import gql from 'graphql-tag';
import ts from 'typescript';
import difference from 'lodash/difference';
import { getSubtypesOfSupertype, getSupertypeOfSubtype, typeFormatToDbTableNameFormat } from './utils';
import typeObjects from '../src/generated/typeObjects.json' assert { type: 'json' };

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// The resolver files that already exist in ./src/resolvers
const typeNames = readdirSync('./src/resolvers').map(file => file.replace('.ts', '')).filter(file => file !== 'index');

generateResolvers().then(() => {
	console.log('===================================================================================');
	console.log(chalk.green('Successfully generated resolver templates.'));
	console.log(chalk.yellow('You probably still need to fill in a bunch of code for everything to actually work how you want, though.\n'));
});

async function generateResolvers() {
	// Parse the GraphQL schema
	const gqlTypes = readFileSync('./src/generated/typeDefs.graphql', 'utf8');
	const parsedSchema = gql`${gqlTypes}`;

	// Parse the TypeScript types
	const tsTypes = readFileSync('./src/generated/source-types.ts', 'utf8');
	const tsSourceFile = ts.createSourceFile(
		'types.ts',
		tsTypes,
		ts.ScriptTarget.Latest,
		true
	);

	const intentionallySkip = Object.entries(typeObjects).map(([typeName, typeObject]) => {
		if(!typeObject.isDirectlyQueryable) {
			return typeName;
		}
	}).flat().filter(Boolean);

	// Create a file for each GraphQL type based on the template and insert likely resolver functions
	visit(parsedSchema, {
		ObjectTypeDefinition(node) {
			console.log(node.name.value, intentionallySkip.includes(node.name.value), existsSync(`./src/resolvers/${node.name.value}.ts`));
			if(!existsSync(`./src/resolvers/${node.name.value}.ts`) && !intentionallySkip.includes(node.name.value)) {
				typeNames.push(node.name.value);
				generateResolverForType(node, tsSourceFile, parsedSchema);
			}
		},
		InterfaceTypeDefinition(node) {
			console.log(node.name.value, intentionallySkip.includes(node.name.value), existsSync(`./src/resolvers/${node.name.value}.ts`));
			if(!existsSync(`./src/resolvers/${node.name.value}.ts`) && !intentionallySkip.includes(node.name.value)) {
				typeNames.push(node.name.value);
				generateResolverForInterface(node, tsSourceFile);
			}
		},
	});

	// Run eslint on the generated files
	exec('eslint --fix ./src/resolvers/**/*.ts', (error, stdout, stderr) => {
		if (error || stderr) {
			console.error(chalk.red(error || stderr));
		}

		console.log(chalk.green('Successfully linted and formatted resolver files'));
	});

	// Generate the updated index file
	let indexContent = 'import merge from \'lodash/merge\';\n';
	let exportLine = 'export default merge({}';
	typeNames.forEach(typeName => {
		indexContent += `import ${typeName}Resolvers from './${typeName}';\n`;
		exportLine += `, ${typeName}Resolvers`;
	});
	indexContent += `\n\n${exportLine})`;
	writeFileSync('./src/resolvers/index.ts', indexContent);
	console.log(chalk.green('Successfully generated index file for resolvers'));


	rl.close();
}

/**
 * Function to generate a resolver file for a concrete type
 * @param node
 * @param tsSourceFile
 * @param parsedSchema
 */
function generateResolverForType(node: ObjectTypeDefinitionNode, tsSourceFile: ts.SourceFile, parsedSchema) {
	const template = readFileSync('./utils/_resolver-template-type.ts', 'utf8');
	const typeName = node.name.value;
	const filename = `./src/resolvers/${typeName}.ts`;
	const supertype = getSupertypeOfSubtype(typeName);
	const groupName = typeFormatToDbTableNameFormat(supertype || typeName);
	const tsFields = getSourceFields(typeName, tsSourceFile);
	const gqlFields = node.fields.map(field => field.name.value);
	const resolverFunctions = [];

	// The core entities match the original TS types generated from the database; this is to resolve those fields
	tsFields.forEach(field => {
		resolverFunctions.push(`${field}: async (${typeName.toLowerCase()}: ${typeName}) => {
			return ${typeName.toLowerCase()}.${field};
		},`);
	});


	// Get the fields that are in the GQL type but not the TS type, because those need to be added to the second section (the extended entity)
	// If there are fields in the GQL type that are not in the TS type, add resolver functions for them here
	const diff = difference(gqlFields, tsFields);
	if (diff.length > 0) {
		diff.forEach(field => {
			//const functionName = `db.${groupName}.get${capitalize(field)}For${capitalize(typeName)}`;
			//const arg = field === 'id' ? 'id' : `${typeName.toLowerCase()}.id`;

			resolverFunctions.push(`${field}: async (${typeName.toLowerCase()}: ${typeName}) => {
				return ${typeName.toLowerCase()}.${field};
			},`);
		});
	}

	const fileContent = template
		.replace('// eslint-disable-next-line @typescript-eslint/ban-ts-comment', '')
		.replace('// @ts-nocheck', '')
		.replace('db.getTemplate', `db.${groupName}.get${typeName}`)
		.replaceAll('Template', typeName)
		.replaceAll('template', typeName.toLowerCase())
		.replace(
			`${typeName}: {}`,
			`${typeName}: {
				${resolverFunctions.join('\n')}
			}`
		);

	writeFileSync(filename, fileContent);
	console.log(chalk.green(`Successfully generated resolver file for ${typeName}`));
}

/**
 * Function to generate a resolver file for an abstract interface type
 * @param node
 * @param tsSourceFile
 */
function generateResolverForInterface(node: InterfaceTypeDefinitionNode, tsSourceFile: ts.SourceFile) {
	const template = readFileSync('./utils/_resolver-template-interface.ts', 'utf8');
	const typeName = node.name.value;
	const filename = `./src/resolvers/${typeName}.ts`;

	const subtypes = getSubtypesOfSupertype(typeName);
	const subtypeFields = subtypes.map(subtype => {
		return getSourceFields(subtype, tsSourceFile);
	});

	// Flatten the subtype field arrays and count occurrences of each field,
	// and then filter unique fields for each subtype while keeping them in separate arrays per subtype
	// The unique fields are used below to determine the content of the __resolveType functions
	const fieldCounts = subtypeFields.flat().reduce((acc, field) => {
		acc[field] = (acc[field] || 0) + 1;

		return acc;
	}, {});
	const uniqueFields = subtypeFields.map(subArray => subArray.filter(field => fieldCounts[field] === 1));

	const fileContent = template
		.replace('// eslint-disable-next-line @typescript-eslint/ban-ts-comment', '')
		.replace('// @ts-nocheck', '')
		.replaceAll('Template', typeName)
		.replaceAll('template', typeName.toLowerCase())
		.replace(
			'// TODO: Add logic here to determine the subtype to return for the extended type',
			`return ${typeName.toLowerCase()}.${uniqueFields[0][0]} ? '${subtypes[0]}' : '${subtypes[1]}'`
		);

	writeFileSync(filename, fileContent);
	console.log(chalk.green(`Successfully generated resolver file for ${typeName}`));
}

/**
 * Function to find an interface by name in the TypeScript types file and get its fields
 * @param sourceFile
 * @param interfaceName
 */
function getSourceFields(interfaceName: string, sourceFile: ts.SourceFile, ) {
	const fields = [];

	function visit(node) {
		// Check if the node is an interface declaration
		if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
			node.members.forEach(member => {
				if (ts.isPropertySignature(member) && member.name) {
					fields.push(member.name.getText());
				}
			});
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);

	return fields;
}

/**
 * Function to ask a yes/no question in the generator
 * @param question
 */
function confirm(question: string) {
	return new Promise((resolve) => {
		rl.question(chalk.cyan(`${question} (y/n): \n`), (answer) => {
			resolve(answer.toLowerCase() === 'y');
		});
	});
}
