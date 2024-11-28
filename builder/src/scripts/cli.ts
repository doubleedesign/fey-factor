import { TmdbApi } from '../datasources/tmdb-api.ts';
import { createFileIfNotExists, db } from '../common.ts';
import chalk from 'chalk';
import { initDb } from './init-db.ts';
import select, { Separator } from '@inquirer/select';
import { PopulationScriptSettings } from './types.ts';
import inquirer from 'inquirer';
import { resetDb } from './reset-db.ts';
import { populateDbTv } from './populate-db-tv.ts';
import { populateDbMovies } from './populate-db-movies.ts';
import { gapFillDb } from './gapfill-db.ts';
import { degreeUpdate } from './degree-update-db.ts';
import { addOrUpdateRelevantSnlPeople } from './populate-snl.ts';


export class BuilderCLI {
	api: TmdbApi;

	constructor() {
		this.api = new TmdbApi({ defaultUseCached: true });
	}

	async run() {
		try {
			await this.goodToGo();
			await this.start();
			await db.closeConnections();
		}
		catch(error) {
			console.error(error);
		}
	}

	async goodToGo() {
		const apiCheck = await this.api.checkConnection();
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

	async getChoice() {
		this.outputSeparator();

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
	async start() {
		this.outputSeparator();

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
			// TODO: More granular cache use settings for refreshing data without re-fetching absolutely everything
			// e.g., don't refetch shows that have ended
			{
				type: 'confirm',
				name: 'useCached',
				message: 'Use cached TMDB responses where available? (Choose "no" if you are expecting new shows, seasons etc)',
				default: true
			}
		]);

		this.api.setUseCached(settings.useCached);

		let answer: string = '';
		while (answer !== 'exit') {
			answer = await this.getChoice();
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
					this.outputSeparator();
					populateDbTv(settings);
					break;
				case 'populate-movies-degree-1':
					this.outputSeparator();
					populateDbMovies({ ...settings, maxDegree: 1 });
					break;
				case 'populate-movies':
					this.outputSeparator();
					console.log(chalk.red('This feature is not ready yet.'));
					populateDbMovies(settings);
					break;
				case 'gapfill':
					this.outputSeparator();
					gapFillDb(settings);
					break;
				case 'update-degree-2-people':
					this.outputSeparator();
					degreeUpdate(settings);
					break;
				case 'handle-snl':
					this.outputSeparator();
					addOrUpdateRelevantSnlPeople(settings);
					break;
				case 'reset':
					this.outputSeparator();
					await resetDb();
					break;
				case 'exit':
					this.outputSeparator();
					await db.closeConnections();
					process.exit(0);
			}
		}
	}

	outputSeparator() {
		console.log(chalk.magenta('\n==============================================='));
	}
}