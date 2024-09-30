import pg from 'pg';
import chalk from 'chalk';
import { Film, Person, TvShow } from './types.ts';
import { customConsole, logToFile } from '../common.ts';
import { WriteStream, createWriteStream } from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const baseConfig = {
	// Can use 'localhost' if using WSL1, but this will not work on WSL2 - need to do some IP magic.
	host: process.env.PG_HOST,
	port: parseInt(process.env.PG_PORT),
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD
};

export class DatabaseConnection {
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

	/**
	 * Test the connection to the database server (does not test the database itself)
	 */
	async testPostgresConnection() {
		try {
			return await this.tempClient.query('SELECT NOW()');
		}
		catch (error) {
			console.log(chalk.red('Connection error: ', error));
			return false;
		}
	}

	/**
	 * Check if the database exists
	 */
	async databaseExists() {
		const response = await this.tempClient.query(
			`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${this.dbName}'`
		);
		return response.rowCount === 1;
	}

	/**
	 * Function to close the connections to the database server when we're done
	 */
	async closeConnections() {
		await this.tempClient.end();
		await this.pgClient.end();
	}

	/**
	 * Create the database if it doesn't already exist
	 */
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

	/**
	 * Drop the database if it exists so we can start again
	 */
	async forceDropDatabase() {
		try {
			console.log('Force dropping database...');
			try {
				// Terminate other connections
				await this.tempClient.query(`
	                SELECT pg_terminate_backend(pg_stat_activity.pid) 
	                FROM pg_stat_activity 
	                WHERE pg_stat_activity.datname = $1 AND pid <> pg_backend_pid();
	            `, [this.dbName]);

				// Drop the database
				await this.tempClient.query(`DROP DATABASE IF EXISTS "${this.dbName}";`);

				console.log(chalk.green(`Force dropped database "${this.dbName}".`));
			}
            catch (error) {
				console.log(chalk.red(`Error force dropping database "${this.dbName}": `, error.message));
			}
		}
		catch (error) {
			console.log(chalk.red(`Error setting up connection to drop database "${this.dbName}": `, error.message));
		}
	}

	/**
	 * Check if a table exists in the database
	 * @param tablename
	 */
	async tableExists(tablename: string) {
		try {
			const result = await this.pgClient.query(`SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = '${tablename}');`);
			return result.rows[0].exists;
		}
		catch (error) {
			console.log(chalk.red(error.message));
		}
	}

	/**
	 * My concept of a "glue" field in a set of foreign keys, where the "glue" is the important one that "sticks" the others together
	 * and will be handled differently in my application than the others.
	 * Under the hood it's an index, but calling it something special makes it easier to use for that purpose.
	 * @param tablename
	 * @param key1
	 * @param key2
	 * @param glueKey
	 */
	async createGlueField(tablename: string, key1: string, key2: string, glueKey: string) {
		await this.pgClient.query(`CREATE INDEX idx_${tablename}_glue_key ON ${tablename} (${key1}, ${key2}, ${glueKey});`);
	}

	/**
	 * Create the tables in the database if they don't already exist
	 */
	async createTables() {
		if(!await this.tableExists('people')) {
			console.log(chalk.cyan('Creating People table...'));
			await this.pgClient.query(`CREATE TABLE public.people
	            (
	                id             integer UNIQUE NOT NULL,
	                name           varchar NOT NULL,
	                degree  	   integer,
	                PRIMARY KEY (id)
	            );
			`);
		}

		if(!await this.tableExists('works')) {
			console.log(chalk.cyan('Creating Works table...'));
			await this.pgClient.query(`CREATE TABLE public.works
	            (
	                id             integer UNIQUE NOT NULL,
	                title          varchar NOT NULL,
		            PRIMARY KEY (id)
	            );
			`);
		}

		if(!await this.tableExists('tv_shows')) {
			if(!await this.tableExists('works')) {
				console.error(chalk.red('Works table does not exist, cannot create TV Shows table.'));
				return;
			}
			console.log(chalk.cyan('Creating TV Shows table...'));
			await this.pgClient.query(`CREATE TABLE public.tv_shows
	            (
                	start_year	    integer,
	                end_year       	integer,
	                season_count	integer,
	                episode_count	integer,
                    UNIQUE (id)
	            ) INHERITS (public.works);
			`);
		}

		if(!await this.tableExists('movies')) {
			if(!await this.tableExists('works')) {
				console.error(chalk.red('Works table does not exist, cannot create Movies table.'));
				return;
			}
			console.log(chalk.cyan('Creating Movies table...'));
			await this.pgClient.query(`CREATE TABLE public.movies
	            (
					release_year	integer,
                    UNIQUE (id)
	            ) INHERITS (public.works);
			`);
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

		if(!await (this.tableExists('connections'))) {
			console.log(chalk.cyan('Creating Connections table...'));
			// Can't use foreign key constraint for work_id because of the inheritance relationship.
			// If I was to explicitly insert it into the works table, then I would lose the benefits of inheritance and create other headaches.
			// So, note to self, if I ever implement deletion functionality, I will need to manually handle deletion of connections when a work is deleted.
			await this.pgClient.query(`CREATE TABLE public.connections
	            (
					id             	SERIAL PRIMARY KEY,
	                person_id	  	integer NOT NULL REFERENCES people(id),
	                work_id       	integer NOT NULL, -- can't use foreign key here because of inheritance - child tables are not checked. 
	                role_id       	integer NOT NULL REFERENCES roles(id),
	                episode_count	integer,
                    UNIQUE 			(person_id, work_id, role_id)
	            );
			`);

			await this.createGlueField('connections', 'person_id', 'work_id', 'role_id');
		}

		console.log(chalk.green('Done creating tables.'));
	}

	/**
	 * Add a role to the database
	 * @param name
	 */
	async createRole(name: string) {
		const response = await this.pgClient.query({
			text: 'INSERT INTO roles(name) VALUES($1)',
			values: [name]
		});
		if (response.rowCount === 1) {
			console.log(chalk.cyan(`Successfully inserted role type ${name}`));
		}
	}

	/**
	 * Get the ID of a role by its name
	 * @param name
	 */
	async getRoleId(name: string) {
		const response = await this.pgClient.query({
			text: 'SELECT id FROM roles WHERE name = $1',
			values: [name]
		});
		return response.rows[0]?.id;
	}

	/**
	 * Get all roles currently in the database
	 */
	async getRoles() {
		const response = await this.pgClient.query('SELECT * FROM roles');
		return response.rows;
	}

	/**
	 * Add a person to the database, or update their data if they already exist
	 * @param person
	 */
	async addOrUpdatePerson(person: Person): Promise<Person> {
		try {
			await this.pgClient.query('BEGIN');

			const response = await this.pgClient.query({
				text: `INSERT INTO people(id, name, degree) 
						VALUES($1, $2, $3) 
                        ON CONFLICT (id) DO UPDATE
							SET degree = EXCLUDED.degree
					`,
				values: [person.id, person.name, person.degree],
			});

			await this.pgClient.query('COMMIT');

			if (response.rowCount === 1) {
				customConsole.success(chalk.green(
					`Successfully inserted or updated person ${person.id}\t ${person.name} at degree ${person.degree}`
				));
			}

			return response.rows[0];
		}
		catch (error) {
			await this.pgClient.query('ROLLBACK');
			customConsole.error(`addOrUpdatePerson error for ${person.id} ${person.name}:\t ${error}`);
			logToFile(this.logFile, `addPerson ${person.id}\t\t ${error}`);
		}
	}

	/**
	 * Get a person by their ID
	 * @param id
	 */
	async getPerson(id: number) {
		const response = await this.pgClient.query({
			text: 'SELECT * FROM people WHERE id = $1',
			values: [id]
		});

		return response.rows[0] ?? false;
	}

	/**
	 * Get the IDs for all TV shows for a given person
	 * @param id
	 */
	async getTvShowIdsForPerson(id: number): Promise<number[]> {
		const response = await this.pgClient.query({
			text: `SELECT DISTINCT(tv_shows.id) from tv_shows
				INNER JOIN connections ON tv_shows.id = connections.work_id
				WHERE connections.person_id = $1`,
			values: [id]
		});

		return response.rows ? response.rows.map(row => row.id) : [];
	}

	/**
	 * Add or update a TV show in the database
	 * Note: TV Shows inherit fields from Works
	 * @param work
	 */
	async addOrUpdateTvShow(work: TvShow): Promise<Partial<TvShow>> {
		try {
			await this.pgClient.query('BEGIN');

			const response = await this.pgClient.query({
				text: `
                    INSERT INTO tv_shows(id, title, start_year, end_year, season_count, episode_count)
                    VALUES($1, $2, $3, $4, $5, $6)
                    ON CONFLICT (id) DO UPDATE
                        SET
                            title = EXCLUDED.title,
                            start_year = COALESCE(EXCLUDED.start_year, tv_shows.start_year),
                            end_year = COALESCE(EXCLUDED.end_year, tv_shows.end_year),
                            season_count = COALESCE(EXCLUDED.season_count, tv_shows.season_count),
                            episode_count = COALESCE(EXCLUDED.episode_count, tv_shows.episode_count)
                    RETURNING id, title
				`,
				values: [work.id, work.name, work.start_year, work.end_year, work.season_count, work.episode_count]
			});

			await this.pgClient.query('COMMIT');

			customConsole.success(`Successfully inserted or updated TV Show ${response.rows[0].id}\t ${response.rows[0].title}`);

			return response.rows[0];
		}
		catch (error) {
			await this.pgClient.query('ROLLBACK');
			customConsole.error(`addOrUpdateTvShow error for \t ${work.id} ${work.name}:\t ${error}`);
			logToFile(this.logFile, `addOrUpdateTvShow ${work.id}\t\t ${error}`);
		}
	}

	/**
	 * Add or update a movie in the database
	 * Note: Movies inherit fields from Works
	 * @param work
	 */
	async addOrUpdateMovie(work: Film): Promise<Partial<Film>> {
		try {
			await this.pgClient.query('BEGIN');

			const response = await this.pgClient.query({
				text: `
                    INSERT INTO movies(id, title, release_year)
                    VALUES($1, $2, $3)
                    ON CONFLICT (id) DO UPDATE
                        SET
                            title = EXCLUDED.title,
                            release_year = COALESCE(EXCLUDED.release_year, movies.release_year)
                    RETURNING id, title
				`,
				values: [work.id, work.name, work.release_year]
			});

			await this.pgClient.query('COMMIT');

			if (response.rowCount === 1) {
				customConsole.success(`Successfully inserted or updated movie ${response.rows[0].id}\t ${response.rows[0].title}`);
			}

			return response.rows[0];
		}
		catch (error) {
			await this.pgClient.query('ROLLBACK');
			customConsole.error(`addOrUpdateMovie error for \t ${work.id} ${work.name}:\t ${error}`);
			logToFile(this.logFile, `addOrUpdateMovie ${work.id}\t\t ${error}`);
		}
	}

	/**
	 * Add a person and a TV show to the database in a single transaction
	 * @param person
	 * @param work
	 */
	async addOrUpdatePersonAndTvShow(person: Person, work: TvShow): Promise<void> {
		try {
			await this.pgClient.query('BEGIN');

			await this.addOrUpdatePerson(person);
			await this.addOrUpdateTvShow(work);

			await this.pgClient.query('COMMIT');
		}
		catch (error) {
			await this.pgClient.query('ROLLBACK');
			console.error('Error in addOrUpdatePersonAndTvShow: ', error);
			throw error;
		}
	}

	/**
	 * Get a single work by its ID (only the minimal fields that are in the Works table)
	 * @param id
	 */
	async getWork(id: number): Promise<Partial<TvShow|Film> | undefined> {
		const response = await this.pgClient.query({
			text: 'SELECT * FROM works WHERE id = $1',
			values: [id]
		});

		return response.rows[0] ?? undefined;
	}

	/**
	 * Get all TV shows currently in the database
	 */
	async getAllTvShows() {
		const response = await this.pgClient.query('SELECT * FROM tv_shows');
		return response.rows;
	}

	/**
	 * Get TV shows that are missing episode counts so they can be populated by subsequent functions
	 * @param qty
	 */
	async getTvShowsMissingEpisodeCounts() {
		const response = await this.pgClient.query(
			'SELECT id, title FROM tv_shows WHERE episode_count IS NULL;'
		);

		return response.rows;
	}

	async getConnectionsMissingEpisodeCounts() {
		const response = await this.pgClient.query(`
			SELECT DISTINCT(work_id) from connections 
			    JOIN tv_shows ON connections.work_id = tv_shows.id 
             	WHERE connections.episode_count is NULL
		`);

		return response.rows;
	}

	/**
	 * Get all movies currently in the database
	 */
	async getAllMovies() {
		const response = await this.pgClient.query('SELECT * FROM movies');

		return response.rows;
	}

	/**
	 * Connect a person to a work in the database
	 * @param personId
	 * @param workId
	 * @param roleId
	 * @param episodeCount
	 */
	async connectPersonToWork(personId: number, workId: number, roleId: number, episodeCount: number) {
		try {
			await this.pgClient.query('BEGIN');

			// Check that the work ID exists, because we can't use a foreign key constraint here due to the inheritance relationship
			const workExists = await this.getWork(workId);
			if(!workExists) {
				throw new Error(`Work ID ${workId} does not exist in the database.`);
			}

			const response = await this.pgClient.query({
				text: `INSERT INTO connections(person_id, work_id, role_id, episode_count)
						VALUES($1, $2, $3, $4)
						ON CONFLICT (person_id, work_id, role_id)
					    DO UPDATE SET episode_count = EXCLUDED.episode_count`,
				values: [personId, workId, roleId, episodeCount]
			});

			await this.pgClient.query('COMMIT');

			if (response.rowCount === 1) {
				if(episodeCount === null) {
					customConsole.success(
						`Successfully connected person ${personId} to movie ${workId} with role ${roleId}`
					);
				}
				else {
					customConsole.success(
						`Successfully connected person ${personId} to work ${workId} with role ${roleId} for ${episodeCount} episodes`
					);
				}
			}
		}
		catch (error) {
			await this.pgClient.query('ROLLBACK');
			customConsole.error(`connectPersonToWork error for ${personId} ${workId}:\t ${error}`);
			logToFile(this.logFile, `connectPersonToWork error for ${personId} ${workId}:\t ${error}`);
		}
	}
}
