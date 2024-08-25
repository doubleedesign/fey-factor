import pg from 'pg';

export class DbRoles {
	constructor(private pgClient: pg.Pool) {}

	async getRole(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM roles WHERE id = $1',
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getConnectionsForRole(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM connections WHERE role_id = $1',
				values: [id]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getPeopleForRole(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM people WHERE id IN (SELECT person_id FROM connections WHERE role_id = $1)',
				values: [id]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getWorksForRole(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM works WHERE id IN (SELECT work_id FROM connections WHERE role_id = $1) AND type IS NOT NULL',
				values: [id]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}
}