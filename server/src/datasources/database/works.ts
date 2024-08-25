import pg from 'pg';
import { TvShowContainer, WorkContainer } from '../../generated/gql-types';

export class DbWorks  {
	constructor(private pgClient: pg.Pool) {}

	async getWork(id: number): Promise<WorkContainer> {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM works WHERE id = $1',
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getTvShow(id: number): Promise<TvShowContainer> {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM tv_shows WHERE id = $1',
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getMovie(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM movies WHERE id = $1',
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}

	async getPeopleForWork(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM people WHERE id IN (SELECT person_id FROM connections WHERE work_id = $1)',
				values: [id]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getRolesForWork(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM roles WHERE id IN (SELECT role_id FROM connections WHERE work_id = $1)',
				values: [id]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getConnectionsForWork(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM connections WHERE work_id = $1',
				values: [id]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getPeopleForTvshow(id: number) {
		return this.getPeopleForWork(id);
	}

	async getPeopleForMovie(id: number) {
		return this.getPeopleForWork(id);
	}

	async getRolesForTvshow(id: number) {
		return this.getRolesForWork(id);
	}

	async getRolesForMovie(id: number) {
		return this.getRolesForWork(id);
	}

	async getConnectionsForTvshow(id: number) {
		return this.getConnectionsForWork(id);
	}

	async getConnectionsForMovie(id: number) {
		return this.getConnectionsForWork(id);
	}
}