import { exec } from 'child_process';
import { promises, readFileSync } from 'fs';
import chalk from 'chalk';
import { generateSchemaTypedefs } from './generate-schema-typedefs';
import { generateGqlToTs } from './generate-gql-to-ts';

// TODO Replace creds with .env values
const username = 'postgres';
const password = 'root';
const dbname = 'feyfactor';
const dbConnectionString = `postgresql://${username}:${password}@localhost:5432/${dbname}`;
const typesOutputFile = './src/generated/source-types.ts';
const gqlTypesOutputFile = './src/generated/gql-types.ts';
const gqlTypesReformattedOutputFile = './src/generated/gql-types-reformatted.ts';

generate().then();

async function generate() {
	try {
		await generateTypes();
		await renameTypes();
		await generateSchema();
	}
	catch (error) {
		handleError(error);
		console.log(chalk.yellow('Did you get the Punycode deprecation error? Try changing your Node version to the latest LTS one.'));
	}
	try {
		await formatFiles();
	}
	catch (error) {
		handleError(error);
	}
}


/**
 * Generate types from the database schema using pg-to-ts
 */
async function generateTypes() {
	outputSeparator();
	console.log('Generating types from the database schema...');

	return new Promise((resolve, reject) => {
		exec(`pg-to-ts generate -c ${dbConnectionString} -o ${typesOutputFile}`, (error, stdout, stderr) => {
			if(error || stderr) {
				reject(error || stderr);
				handleError(error || stderr);
			}

			console.log(chalk.green(`Successfully generated types in ${typesOutputFile}`));
			resolve(stdout);
		});
	});
}

/**
 * Rename the types from plural table names to singular type names
 */
async function renameTypes() {
	outputSeparator();
	console.log('Renaming types from plural table names to singular type names...');

	try {
		const data = readFileSync(typesOutputFile, 'utf8');

		// Update the names of the types from plurals to singulars
		const result = data.replace(/\bPeople\b/g, 'Person')
			.replace(/\bPeopleInput\b/g, 'PersonInput')
			.replace(/\bWorks\b/g, 'Work')
			.replace(/\bWorksInput\b/g, 'WorkInput')
			.replace(/\bTvShows\b/g, 'TvShow')
			.replace(/\bTvShowsInput\b/g, 'TvShowInput')
			.replace(/\bMovies\b/g, 'Movie')
			.replace(/\bMoviesInput\b/g, 'MovieInput')
			.replace(/\bConnections\b/g, 'Connection')
			.replace(/\bConnectionsInput\b/g, 'ConnectionInput')
			.replace(/\bRoles\b/g, 'Role')
			.replace(/\bRolesInput\b/g, 'RoleInput');

		// Write the modified file back
		await promises.writeFile(typesOutputFile, result, 'utf8');

		console.log(chalk.green(`Successfully renamed types in ${typesOutputFile}`));
	}
	catch (error) {
		handleError(error);
	}
}

/**
 * Format the generated files using ESLint
 */
async function formatFiles() {
	outputSeparator();
	console.log('Linting and formatting files with ESLint...');

	try {
		// Remove eslint-disable comment from the generated file
		const data = readFileSync(typesOutputFile, 'utf8');
		const result = data.replace('/* eslint-disable */', '');
		await promises.writeFile(typesOutputFile, result, 'utf8');
		console.log(chalk.green(`Successfully enabled ESLint for ${typesOutputFile}`));

		// Run ESLint
		return new Promise((resolve, reject) => {
			exec('eslint --fix ./src/generated/', (error, stdout, stderr) => {
				if(error || stderr) {
					reject(error || stderr);
					handleError(error || stderr);
				}

				console.log(chalk.green('Successfully linted and formatted generated files'));
				resolve(stdout);
			});
		});
	}
	catch (error) {
		handleError(error);
	}
}

/**
 * Generate GraphQL type definitions from the TypeScript types
 * and then generate TypeScript types from the GraphQL schema because it adds fields not present in the source types
 */
async function generateSchema() {
	outputSeparator();
	console.log('Generating GraphQL type definitions');

	// Generate the schema type definitions from the pg-to-ts generated TypeScript interfaces + some manual additions
	await generateSchemaTypedefs(typesOutputFile);

	// Go back the other way - run graphql-codegen to generate TypeScript types from the updated GraphQL schema
	await generateGqlToTs(gqlTypesOutputFile, gqlTypesReformattedOutputFile);
}

/**
 * Shared function to handle errors
 * @param error
 */
function handleError(error: Error | string | null) {
	if(error instanceof Error) {
		console.error(`Error: ${error.message}`);
	}

	console.error(chalk.red(error));

	return;
}

function outputSeparator() {
	console.log(chalk.magenta('==================================================================='));
}
