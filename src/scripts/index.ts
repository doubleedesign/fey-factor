import select, { Separator } from '@inquirer/select';
import chalk from 'chalk';
import { initDb } from './init-db.ts';
import { resetDb } from './reset-db.ts';
import { populateDbTv } from './populate-db-tv.ts';
import { db, customConsole, wait } from '../common.ts';
import inquirer from 'inquirer';
import { topupDb } from './topup-db.ts';
import { gapFillDb } from './gapfill-db.ts';
import { populateDbMovies } from './populate-db-movies.ts';
import { PopulationScriptSettings } from './types.ts';


function outputSeparator() {
	console.log(chalk.magenta('\n==============================================='));
}

async function getChoice() {
	await customConsole.waitForQueue();
	customConsole.info('\n', true);
	await wait(1000);
	outputSeparator();

	return select({
		message: 'What would you like to do?',
		choices: [
			{
				name: 'Step 1: Initialise empty database (drops database if it already exists)',
				value: 'reset-init'
			},
			{
				name: 'Step 2: Populate with initial TV show data',
				value: 'populate-tv'
			},
			{
				name: 'Step 3: Fill in missing TV show data after initial population',
				value: 'gapfill',
			},
			{
				name: 'Step 4: Populate movie data',
				value: 'populate-movies',
			},
			{
				name: 'Step 5: Top up database with complete data for top TV shows',
				value: 'top-up',
			},
			new Separator(),
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

	topupDb({ count: numberOfShows.count, ...settings });
}

async function start() {
	let answer = null;
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
		{
			type: 'input',
			name: 'maxDegree',
			message: 'Max degrees of separation to process:',
			default: 2,
		},
		{
			type: 'confirm',
			name: 'verboseLogging',
			message: 'Use verbose logging?',
			default: true
		}
	]);

	customConsole.verbose = settings.verboseLogging;


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
			case 'populate-movies':
				outputSeparator();
				populateDbMovies(settings);
				break;
			case 'gapfill':
				outputSeparator();
				gapFillDb(settings);
				break;
			case 'top-up':
				outputSeparator();
				await doTvTopup(settings);
				break;
			case 'reset':
				outputSeparator();
				await resetDb();
				break;
			case 'exit':
				outputSeparator();
				process.exit(0);
		}
	}
}

await start();
