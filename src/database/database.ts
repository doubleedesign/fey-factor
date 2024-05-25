import pg from 'pg';
import chalk from 'chalk';
import { Film, Person, TvShow } from './types.ts';
import { logToFile } from '../common.ts';
import { WriteStream, createWriteStream } from 'fs';

const baseConfig = {
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
			console.log('musicstats database not found, creating it.');
			await this.tempClient.query(`CREATE DATABASE "${this.dbName}";`);
			console.log(chalk.green(`Created database "${this.dbName}".`));
		}
		else {
			console.log(chalk.yellow(`Database "${this.dbName}" already exists.`));
		}
	}

	async dropDatabase() {
		const response = await this.tempClient.query(
			`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${this.dbName}'
		`);
		if (response.rowCount === 1) {
			console.log('Database found, dropping it.');
			await this.tempClient.query(`DROP DATABASE "${this.dbName}";`);
			console.log(chalk.green(`Dropped database "${this.dbName}".`));

		}
		else {
			console.log(chalk.yellow(`Database "${this.dbName}" does not exist.`));
		}

	}

	async testPostgresConnection() {
		try {
			const connected = await this.pgClient.query('SELECT NOW()');
			if (connected.rows) {
				console.log(chalk.green('Successfully connected to Postgres database'));
				return true;
			}
			else {
				throw new Error('Connection error');
			}
		}
		catch (error) {
			console.log(chalk.red('Connection error: ', error));
			return false;
		}
	}

	async tableExists(tablename: string) {
		const result = await this.pgClient.query(`SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = '${tablename}');`);
		return result.rows[0].exists;
	}

	async createTables() {
		if (!await this.tableExists('people')) {
			console.log('Creating People table...');
			await this.pgClient.query(`CREATE TABLE public.people
	            (
	                id             integer UNIQUE NOT NULL,
	                name           varchar,
	                fey_number	   integer,
	                PRIMARY KEY (id)
	            );
			`);
		}
		else {
			console.log(chalk.yellow('People table already exists. Skipping.'));
		}

		if (!await (this.tableExists('work_types'))) {
			console.log('Creating Work Types table...');
			await this.pgClient.query(`CREATE TABLE public.work_types
	            (
	                id             SERIAL,
	                name           varchar UNIQUE,
	                PRIMARY KEY (id)
	            );
			`);
		}
		else {
			console.log(chalk.yellow('Work Types table already exists. Skipping.'));
		}

		if(!await this.tableExists('works')) {
			console.log('Creating Works table...');
			await this.pgClient.query(`CREATE TABLE public.works
	            (
	                id             	integer UNIQUE NOT NULL,
	                title          	varchar UNIQUE,
                	release_year    integer NOT NULL, 
	                end_year       	integer,
	                season_count	integer,
	                episode_count	integer,
	              	type		   	integer NOT NULL REFERENCES work_types(id),
	                PRIMARY KEY (id)
	            );
			`);
		}
		else {
			console.log(chalk.yellow('Works table already exists. Skipping.'));
		}

		if(!await this.tableExists('roles')) {
			console.log('Creating Roles table...');
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

		if (!await (this.tableExists('connections'))) {
			console.log('Creating Connections table...');
			await this.pgClient.query(`CREATE TABLE public.connections
	            (
					id             	SERIAL PRIMARY KEY,
	                person_id	  	integer NOT NULL REFERENCES people(id),
	                work_id       	integer NOT NULL REFERENCES works(id),
	                role_id       	integer NOT NULL REFERENCES roles(id),
	                episode_count	integer
	            );
			`);
		}
		else {
			console.log(chalk.yellow('Connections table already exists. Skipping.'));
		}

		console.log(chalk.green('Done creating tables.'));
	}

	async createWorkType(name: string) {
		const response = await this.pgClient.query({
			text: 'INSERT INTO work_types(name) VALUES($1)',
			values: [name]
		});
		if (response.rowCount === 1) {
			console.log(chalk.green(`Successfully inserted work type ${name}`));
		}
	}

	async getWorkTypeId(name: string) {
		const response = await this.pgClient.query({
			text: 'SELECT id FROM work_types WHERE name = $1',
			values: [name]
		});
		return response.rows[0].id;

	}

	async createRole(name: string) {
		const response = await this.pgClient.query({
			text: 'INSERT INTO roles(name) VALUES($1)',
			values: [name]
		});
		if (response.rowCount === 1) {
			console.log(chalk.green(`Successfully inserted role type ${name}`));
		}
	}

	async getRoleId(name: string) {
		const response = await this.pgClient.query({
			text: 'SELECT id FROM roles WHERE name = $1',
			values: [name]
		});
		return response.rows[0].id;
	}

	async getRoles() {
		const response = await this.pgClient.query('SELECT * FROM roles');
		return response.rows;
	}

	async getPerson(id: number) {
		const response = await this.pgClient.query({
			text: 'SELECT * FROM people WHERE id = $1',
			values: [id]
		});
		return response.rows[0] ?? false;
	}

	async addPerson(person: Person) {
		try {
			const response = await this.pgClient.query({
				text: 'INSERT INTO people(id, name, fey_number) VALUES($1, $2, $3) ON CONFLICT (id) DO NOTHING',
				values: [person.id, person.name, person.feyNumber],
			});
			if (response.rowCount === 1) {
				console.log(chalk.green(`Successfully inserted person ${person.name}`));
			}
		}
		catch (error) {
			console.log(chalk.red('addPerson\t: ', error));
			logToFile(this.logFile, `addPerson\t\t ${error}`);
		}
	}

	async getWork(id: number) {
		const response = await this.pgClient.query({
			text: 'SELECT * FROM works WHERE id = $1',
			values: [id]
		});
		return response.rows[0] ?? false;
	}

	// TODO: Handle movies
	async addTvShow(work: TvShow) {
		try {
			const response = await this.pgClient.query({
				text: `INSERT INTO works(id, title, release_year, end_year, season_count, episode_count, type) 
						VALUES($1, $2, $3, $4, $5, $6, $7)
						ON CONFLICT (id) DO NOTHING`,
				values: [work.id, work.name, work.release_year, work.end_year, work.season_count, work.episode_count, work.type]
			});
			if (response.rowCount === 1) {
				console.log(chalk.green(`Successfully inserted work ${work.name}`));
			}
		}
		catch (error) {
			console.log(chalk.red('addTvShow\t', error));
			logToFile(this.logFile, `addTvShow\t\t ${error}`);
		}
	}

	async connectPersonToWork(personId: number, workId: number, roleId: number, episodeCount: number) {
		try {
			const response = await this.pgClient.query({
				text: 'INSERT INTO connections(person_id, work_id, role_id, episode_count) VALUES($1, $2, $3, $4)',
				values: [personId, workId, roleId, episodeCount]
			});
			if (response.rowCount === 1) {
				console.log(chalk.green(
				`Successfully connected person ${personId} to work ${workId} with role ${roleId} for ${episodeCount} episodes`
				));
			}
		}
		catch (error) {
			console.log(chalk.red(`connectPersontoWork\t personId: ${personId}\t workId: ${workId}`, error));
			logToFile(this.logFile, `connectPersonTowork\t\t ${error}`);
		}
	}
}
