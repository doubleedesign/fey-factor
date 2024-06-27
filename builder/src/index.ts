import inquirer from 'inquirer';
import select, { Separator } from '@inquirer/select';
import chalk from 'chalk';
import { db, customConsole, wait } from './common.ts';
import { initDb } from './scripts/init-db.ts';
import { resetDb } from './scripts/reset-db.ts';
import { populateDbTv } from './scripts/populate-db-tv.ts';
import { topupDb } from './scripts/topup-db.ts';
import { gapFillDb } from './scripts/gapfill-db.ts';
import { populateDbMovies } from './scripts/populate-db-movies.ts';
import { PopulationScriptSettings } from './scripts/types.ts';
import { LoggingType } from './utils/CustomConsole/CustomConsole.ts';
import { degreeUpdate } from './scripts/degree-update-db.ts';


function outputSeparator() {
	console.log(chalk.magenta('\n==============================================='));
}

async function getChoice() {
	await customConsole.waitForQueue();
	await wait(1000);
	//customConsole.clearConsole();
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
				name: 'Step 5: Top up database with complete data for top TV shows',
				value: 'top-up',
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

async function doTvTopup(settings: PopulationScriptSettings & { count: number }) {
	const numberOfShows = await inquirer.prompt([
		{
			type: 'input',
			name: 'count',
			message: 'Number of shows to top up:',
			default: 20
		}
	]);

	topupDb({ ...settings, count: numberOfShows.count });
}

async function start() {
	let answer = '';
	outputSeparator();

	console.log(chalk.yellow('If a success message appears after data population and then nothing seems to be happening, ' +
		'press an arrow key. The menu will probably reappear then.'));

	const settings = await inquirer.prompt([
		{
			type: 'input',
			name: 'startPersonId',
			message: 'The Movie Database person ID to start from:',
			default: 56323
		},
		// TODO: Add option to set database name
		// TODO: Option to add start year/year range
		{
			type: 'input',
			name: 'maxDegree',
			message: 'Max degrees of separation to process:',
			default: 2,
		},
	]);

	const loggingStyle: LoggingType = await select({
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

	customConsole.style = loggingStyle;

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
				//populateDbMovies(settings);
				break;
			case 'gapfill':
				outputSeparator();
				gapFillDb(settings);
				break;
			case 'top-up':
				outputSeparator();
				await doTvTopup(settings);
				break;
			case 'update-degree-2-people':
				outputSeparator();
				degreeUpdate(settings);
				break;
			case 'reset':
				outputSeparator();
				await resetDb();
				break;
			case 'reset-movies':
				outputSeparator();
				console.log(chalk.red('Not implemented yet.'));
				break;
			case 'reset-tv':
				outputSeparator();
				console.log(chalk.red('Not implemented yet.'));
				break;
			case 'exit':
				outputSeparator();
				process.exit(0);
		}
	}
}

outputSeparator();
await start();
