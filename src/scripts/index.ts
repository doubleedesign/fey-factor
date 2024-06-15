import select, { Separator } from '@inquirer/select';
import chalk from 'chalk';
import { initDb } from './init-db.ts';
import { resetDb } from './reset-db.ts';
import { populateDb } from './populate-db.ts';
import { db, customConsole, wait } from '../common.ts';
import inquirer from 'inquirer';
import { topupDb } from './topup-db.ts';
import { gapFillDb } from './gapfill-db.ts';

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
				name: 'Steps 1 and 2: Initialise and populate database (drops database if it already exists)',
				value: 'reset-init-populate'
			},
			{
				name: 'Step 3: Fill in missing TV show data after initial population',
				value: 'gapfill',
			},
			{
				name: 'Step 4: Top up database with complete data for top shows',
				value: 'top-up',
			},
			new Separator(),
			{
				name: 'Drop and re-initialise database',
				value: 'reset-init',
			},
			{
				name: 'Populate database that has already been initialised',
				value: 'populate',
			},
			{
				name: 'Drop database without re-initialising',
				value: 'reset',
			},
			new Separator(),
			{
				name: 'Exit',
				value: 'exit',
			},
		],
	});
}

async function doPopulate() {
	const startPerson = await inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'The Movie Database person ID to start from (default = Tina Fey):',
			default: 56323
		}
	]);

	const verboseLogging = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'verbose',
			message: 'Use verbose logging?',
			default: true
		}
	]);

	customConsole.verbose = verboseLogging.verbose;
	populateDb({ startPersonId: startPerson.id });
}

async function doGapFill() {
	const verboseLogging = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'verbose',
			message: 'Use verbose logging?',
			default: true
		}
	]);

	customConsole.verbose = verboseLogging.verbose;
	gapFillDb();
}

async function doTopup() {
	const numberOfShows = await inquirer.prompt([
		{
			type: 'input',
			name: 'count',
			message: 'Number of shows to top up:',
			default: 20
		}
	]);

	const verboseLogging = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'verbose',
			message: 'Use verbose logging?',
			default: true
		}
	]);

	customConsole.verbose = verboseLogging.verbose;
	topupDb({ count: numberOfShows.count });
}

async function start() {
	let answer = null;
	outputSeparator();

	while (answer !== 'exit') {
		answer = await getChoice();
		switch (answer) {
			case 'reset-init':
			case 'reset-init-populate':
				// TODO: Option to set db name here
				// eslint-disable-next-line no-case-declarations
				const dbExists = await db.databaseExists();
				if (dbExists) {
					await resetDb();
					await initDb();
				}
				else {
					await initDb();
				}
				if (answer === 'reset-init-populate') {
					await doPopulate();
				}
				break;
			case 'reset':
				outputSeparator();
				await resetDb();
				break;
			case 'populate':
				outputSeparator();
				await doPopulate();
				break;
			case 'gapfill':
				outputSeparator();
				await doGapFill();
				break;
			case 'top-up':
				outputSeparator();
				await doTopup();
				break;
			case 'exit':
				outputSeparator();
				process.exit(0);
		}
	}
}

await start();
