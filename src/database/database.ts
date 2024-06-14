import pg from 'pg';
import chalk from 'chalk';
import { Film, Person, TvShow } from './types.ts';
import { customConsole, logToFile, wait } from '../common.ts';
import { WriteStream, createWriteStream } from 'fs';

const baseConfig = {
	// Can use 'localhost' if using WSL1, but this will not work on WSL2 - need to do some IP magic.
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: 'root'
};

export class Database {
	dbName: string = 'feyfactor';
	tempClient: pg.Pool = new pg.Pool(baseConfig); // No database selected
	pgClient: pg.Pool; // Will be assigned with database selected
	logFile: WriteStream;

	constructor() {
		this.pgClient = new pg.Pool({
			...baseConfig,
			database: this.dbName
		});
		this.logFile = createWriteStream('./logs/database.log');
	}

	async createDatabase() {
		const response = await this.tempClient.query(
			`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${this.dbName}'
		`);
		if (response.rowCount === 0) {
			console.log('Database not found, creating it.');
			await this.tempClient.query(`CREATE DATABASE "${this.dbName}";`);
			console.log(chalk.green(`Created database "${this.dbName}".`));
		}
		else {
			console.log(chalk.yellow(`Database "${this.dbName}" already exists.`));
		}
	}

	async forceDropDatabase() {
		try {
			console.log('Force dropping database...');
			await this.tempClient.query(
				`SELECT pg_terminate_backend(pg_stat_activity.pid) 
								FROM pg_stat_activity 
								WHERE pg_stat_activity.datname = '${this.dbName}' AND pid <> pg_backend_pid();`);
			await this.tempClient.query(`DROP DATABASE "${this.dbName}";`);
			console.log(chalk.green(`Force dropped database "${this.dbName}".`));
		}
        catch (error) {
			console.log(chalk.red(`Error force dropping database "${this.dbName}": `, error));
		}
	}

	async databaseExists() {
		const response = await this.tempClient.query(
			`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${this.dbName}'`
		);
		return response.rowCount === 1;
	}

	async testPostgresConnection() {
		try {
			return await this.pgClient.query('SELECT NOW()');
		}
		catch (error) {
			console.log(chalk.red('Connection error: ', error));
			return false;
		}
	}

	async tableExists(tablename: string) {
		try {
			const result = await this.pgClient.query(`SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = '${tablename}');`);
			return result.rows[0].exists;
		}
		catch (error) {
			console.log(chalk.red(error.message));
		}
	}

	async createTables() {
		if (!await this.tableExists('people')) {
			console.log(chalk.cyan('Creating People table...'));
			await this.pgClient.query(`CREATE TABLE public.people
	            (
	                id             integer UNIQUE NOT NULL,
	                name           varchar,
	                degree  	   integer,
	                PRIMARY KEY (id)
	            );
			`);
		}
		else {
			console.log(chalk.yellow('People table already exists. Skipping.'));
		}

		if(!await this.tableExists('tv_shows')) {
			console.log(chalk.cyan('Creating TV Shows table...'));
			await this.pgClient.query(`CREATE TABLE public.tv_shows
	            (
	                id             	integer UNIQUE NOT NULL,
	                title          	varchar UNIQUE,
                	start_year	    integer,
	                end_year       	integer,
	                season_count	integer,
	                episode_count	integer,
	                PRIMARY KEY (id)
	            );
			`);
		}
		else {
			console.log(chalk.yellow('TV Shows table already exists. Skipping.'));
		}

		if(!await this.tableExists('roles')) {
			console.log(chalk.cyan('Creating Roles table...'));
			await this.pgClient.query(`CREATE TABLE public.roles
	            (
	                id             SERIAL,
	                name           varchar UNIQUE,
	                PRIMARY KEY (id)
	            );
			`);
		}
		else {
			console.log(chalk.yellow('Roles table already exists. Skipping.'));
		}

		// TODO: Account for movies
		if (!await (this.tableExists('connections'))) {
			console.log(chalk.cyan('Creating Connections table...'));
			await this.pgClient.query(`CREATE TABLE public.connections
	            (
					id             	SERIAL PRIMARY KEY,
	                person_id	  	integer NOT NULL REFERENCES people(id),
	                work_id       	integer NOT NULL REFERENCES tv_shows(id),
	                role_id       	integer NOT NULL REFERENCES roles(id),
	                episode_count	integer,
                    UNIQUE 			(person_id, work_id, role_id)
	            );
			`);
		}
		else {
			console.log(chalk.yellow('Connections table already exists. Skipping.'));
		}

		console.log(chalk.green('Done creating tables.'));
	}

	async createRole(name: string) {
		const response = await this.pgClient.query({
			text: 'INSERT INTO roles(name) VALUES($1)',
			values: [name]
		});
		if (response.rowCount === 1) {
			console.log(chalk.cyan(`Successfully inserted role type ${name}`));
		}
	}

	async getRoleId(name: string) {
		const response = await this.pgClient.query({
			text: 'SELECT id FROM roles WHERE name = $1',
			values: [name]
		});
		return response.rows[0]?.id;
	}

	async getRoles() {
		const response = await this.pgClient.query('SELECT * FROM roles');
		return response.rows;
	}

	async addOrUpdatePerson(person: Person) {
		try {
			const response = await this.pgClient.query({
				text: `INSERT INTO people(id, name, degree) 
						VALUES($1, $2, $3) 
                        ON CONFLICT (id) DO UPDATE
						SET degree = COALESCE(NULLIF(people.degree, null), EXCLUDED.degree, people.degree)
					`,
				values: [person.id, person.name, person.degree],
			});
			if (response.rowCount === 1) {
				customConsole.success(chalk.green(
					`Successfully inserted or updated person ${person.id}\t ${person.name} at degree ${person.degree}`
				));
			}
		}
		catch (error) {
			customConsole.error(`addPerson error for ${person.id} ${person.name}:\t ${error}`);
			logToFile(this.logFile, `addPerson ${person.id}\t\t ${error}`);
		}
	}

	async getPerson(id: number) {
		const response = await this.pgClient.query({
			text: 'SELECT * FROM people WHERE id = $1',
			values: [id]
		});
		return response.rows[0] ?? false;
	}

	async getAllPeople() {
		const response = await this.pgClient.query('SELECT * FROM people');
		return response.rows;
	}

	async addOrUpdateTvShow(work: TvShow) {
		try {
			const response = await this.pgClient.query({
				text: `INSERT INTO tv_shows(id, title, start_year, end_year, season_count, episode_count)
                    VALUES($1, $2, $3, $4, $5, $6)
                    ON CONFLICT (id) DO UPDATE
                        SET
                            title = COALESCE(NULLIF(tv_shows.title, null), EXCLUDED.title, tv_shows.title),
                            start_year = COALESCE(NULLIF(tv_shows.start_year, null), EXCLUDED.start_year, tv_shows.start_year),
                            end_year = COALESCE(NULLIF(tv_shows.end_year, null), EXCLUDED.end_year, tv_shows.end_year),
                            season_count = COALESCE(NULLIF(tv_shows.season_count, null), EXCLUDED.season_count, tv_shows.season_count),
                            episode_count = COALESCE(NULLIF(tv_shows.episode_count, null), EXCLUDED.episode_count, tv_shows.episode_count)
					`,
				values: [work.id, work.name, work.start_year, work.end_year, work.season_count, work.episode_count]
			});
			if (response.rowCount === 1) {
				customConsole.success(`Successfully inserted or updated TV show ${work.id}\t ${work.name}`);
			}
		}
		catch (error) {
			customConsole.error(`addOrUpdateTvShow error for \t ${work.id} ${work.name}:\t ${error}`);
			logToFile(this.logFile, `addOrUpdateTvShow ${work.id}\t\t ${error}`);
		}
	}

	async getAllTvShows() {
		const response = await this.pgClient.query('SELECT * FROM tv_shows');
		return response.rows;
	}

	async connectPersonToWork(personId: number, workId: number, roleId: number, episodeCount: number) {
		try {
			const response = await this.pgClient.query({
				text: `INSERT INTO connections(person_id, work_id, role_id, episode_count) 
						VALUES($1, $2, $3, $4)
						ON CONFLICT (person_id, work_id, role_id) 
					    DO UPDATE SET episode_count = EXCLUDED.episode_count`,
				values: [personId, workId, roleId, episodeCount]
			});
			if (response.rowCount === 1) {
				customConsole.success(
					`Successfully connected person ${personId} to work ${workId} with role ${roleId} for ${episodeCount} episodes`
				);
			}
		}
		catch (error) {
			customConsole.error(`connectPersonToWork error for ${personId} ${workId}:\t ${error}`);
			logToFile(this.logFile, `connectPersonToWork error for ${personId} ${workId}:\t ${error}`);
		}
	}
}
