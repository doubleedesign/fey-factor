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

	async getPerson(id: number) {
		const response = await this.pgClient.query({
			text: 'SELECT * FROM people WHERE id = $1',
			values: [id]
		});
		return response.rows[0] ?? false;
	}

	async getConnectionsForPerson(id: number) {
		const response = await this.pgClient.query({
			text: 'SELECT * FROM connections WHERE person_id = $1',
			values: [id]
		});
		return response.rows;
	}
}
