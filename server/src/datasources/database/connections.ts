import pg from 'pg';

export class DbConnectionEntities {
	constructor(private pgClient: pg.Pool) {}

	async getConnection(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM connections WHERE id = $1',
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getPersonForConnection(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM people WHERE id = (SELECT person_id FROM connections WHERE id = $1)',
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getWorkForConnection(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM works WHERE id = (SELECT work_id FROM connections WHERE id = $1)',
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getRoleForConnection(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM roles WHERE id = (SELECT role_id FROM connections WHERE id = $1)',
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}
}