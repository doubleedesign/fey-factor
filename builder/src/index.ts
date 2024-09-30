import inquirer from 'inquirer';
import select, { Separator } from '@inquirer/select';
import chalk from 'chalk';
import { db, customConsole, wait, createFileIfNotExists, api } from './common.ts';
import { initDb } from './scripts/init-db.ts';
import { resetDb } from './scripts/reset-db.ts';
import { populateDbTv } from './scripts/populate-db-tv.ts';
import { gapFillDb } from './scripts/gapfill-db.ts';
import { populateDbMovies } from './scripts/populate-db-movies.ts';
import { PopulationScriptSettings } from './scripts/types.ts';
// noinspection ES6PreferShortImport
import { LoggingType } from './utils/CustomConsole/index.ts';
import { degreeUpdate } from './scripts/degree-update-db.ts';
import { addOrUpdateRelevantSnlPeople } from './scripts/populate-snl.ts';


function outputSeparator() {
	console.log(chalk.magenta('\n==============================================='));
}

async function goodToGo() {
	const apiCheck = await api.checkConnection();
	apiCheck ? console.log(chalk.green('TMDB API connection successful')) : console.error(chalk.red('TMDB API connection failed'));
	const pgCheck = await db.testPostgresConnection();
	pgCheck ? console.log(chalk.green('Postgres connection successful')) : console.error(chalk.red('Postgres connection failed'));
	const dbCheck = await db.databaseExists();
	dbCheck ? console.log(chalk.green('Database exists')) : console.warn(chalk.yellow('Database does not exist'));

	if(!apiCheck || !pgCheck) {
		console.log(chalk.red('Check your credentials in the .env file'));
		process.exit(1);
	}
	if(!dbCheck) {
		console.log(chalk.yellow('Initialising database'));
		await initDb();
	}

	await createFileIfNotExists('./logs/database.log');
	await createFileIfNotExists('./logs/tmdb-api.log');
}

async function getChoice() {
	await customConsole.waitForQueue();
	await wait(1000);
	customConsole.clearConsole();
	outputSeparator();

	return select({
		message: 'What would you like to do?',
		choices: [
			{
				name: 'Step 1: Populate with initial TV show data',
				value: 'populate-tv'
			},
			{
				name: 'Step 2: Fill in missing TV show data after initial population',
				value: 'gapfill',
			},
			{
				name: 'Step 3: Populate movie data for degree 0-1 only',
				value: 'populate-movies-degree-1',
			},
			{
				name: 'Step 4: Update degree 2 people who would be degree 1 if the inclusion threshold for TV shows was lower',
				value: 'update-degree-2-people'
			},
			{
				name: 'Step 5: Add or update people who were involved in SNL in the relevant years',
				value: 'handle-snl',
			},
			new Separator(),
			{
				name: 'DANGER ZONE: Initialise empty database (drops database if it already exists)',
				value: 'reset-init'
			},
			{
				name: 'DANGER ZONE: Drop database without re-initialising',
				value: 'reset',
			},
			new Separator(),
			{
				name: 'Exit',
				value: 'exit',
			},
			new Separator(),
		],
	});
}

// TODO: Add option to set database name
// TODO: Option to add start year/year range
async function start() {
	outputSeparator();

	console.log(chalk.yellow('If a success message appears after data population and then nothing seems to be happening, ' +
		'press an arrow key. The menu will probably reappear then.'));

	const settings: PopulationScriptSettings = await inquirer.prompt([
		{
			type: 'input',
			name: 'startPersonId',
			message: 'The Movie Database person ID to start from:',
			default: 56323
		},
		{
			type: 'input',
			name: 'maxDegree',
			message: 'Max degrees of separation to process:',
			default: 2,
		},
	]);

	customConsole.style = await select({
		message: 'Logging style:',
		choices: [
			{
				name: 'Verbose',
				value: LoggingType.VERBOSE
			},
			{
				name: 'Pretty/transient',
				value: LoggingType.PRETTY
			},
			{
				name: 'Progress bars',
				value: LoggingType.PROGRESS
			}
		]
	});

	let answer: string = '';
	while (answer !== 'exit') {
		answer = await getChoice();
		switch (answer) {
			case 'reset-init':
			case 'reset-init-populate':
				// eslint-disable-next-line no-case-declarations
				const dbExists = await db.databaseExists();
				if (dbExists) {
					await resetDb();
					await initDb();
				}
				else {
					await initDb();
				}
				break;
			case 'populate-tv':
				outputSeparator();
				populateDbTv(settings);
				break;
			case 'populate-movies-degree-1':
				outputSeparator();
				populateDbMovies({ ...settings, maxDegree: 1 });
				break;
			case 'populate-movies':
				outputSeparator();
				console.log(chalk.red('This feature is not ready yet.'));
				populateDbMovies(settings);
				break;
			case 'gapfill':
				outputSeparator();
				gapFillDb(settings);
				break;
			case 'update-degree-2-people':
				outputSeparator();
				degreeUpdate(settings);
				break;
			case 'handle-snl':
				outputSeparator();
				addOrUpdateRelevantSnlPeople(settings);
				break;
			case 'reset':
				outputSeparator();
				await resetDb();
				break;
			case 'exit':
				outputSeparator();
				await db.closeConnections();
				process.exit(0);
		}
	}
}

try {
	await goodToGo();
	await start();
	await db.closeConnections();
}
catch(error) {
	console.error(error);
}

