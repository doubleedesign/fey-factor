import pg from 'pg';

const baseConfig = {
	// Can use 'localhost' if using WSL1, but this will not work on WSL2 - need to do some IP magic.
	host: 'localhost', 
	port: 5432,
	user: 'postgres',
	password: 'root'
};

export class DatabaseConnection {
	dbName: string = 'feyfactor';
	pgClient: pg.Pool;

	constructor() {
		this.pgClient = new pg.Pool({
			...baseConfig,
			database: this.dbName
		});
	}
}
