import pg from 'pg';
import { Connection, Movie, Person, Role, TvShow, Work } from '../../generated/source-types';

type RoleWithEpisodeCount = Role & { episode_count?: Connection['episode_count'] };

export class DbWorks  {
	constructor(private pgClient: pg.Pool) {}

	async getWork(id: number): Promise<Work> {
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

	async getTvShow(id: number): Promise<TvShow> {
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

	async getMovie(id: number): Promise<Movie> {
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

	async getPeopleForWork(id: number): Promise<Person[]> {
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

	async getRolesForWork(id: number): Promise<Role[]> {
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

	async getConnectionsForWork(id: number): Promise<Connection[]> {
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

	async getPeopleForTvshow(id: number): Promise<Person[]> {
		return this.getPeopleForWork(id);
	}

	async getPeopleForMovie(id: number): Promise<Person[]> {
		return this.getPeopleForWork(id);
	}

	async getRolesForTvshow(id: number): Promise<Role[]> {
		return this.getRolesForWork(id);
	}

	async getRolesForMovie(id: number): Promise<Role[]> {
		return this.getRolesForWork(id);
	}

	async getConnectionsForTvshow(id: number): Promise<Connection[]> {
		return this.getConnectionsForWork(id);
	}

	async getConnectionsForMovie(id: number): Promise<Connection[]> {
		return this.getConnectionsForWork(id);
	}

	async getPersonsRolesForWork(personId: number, workId: number): Promise<RoleWithEpisodeCount[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT role_id, roles.name, episode_count FROM connections
                              JOIN roles ON connections.role_id = roles.id
                              WHERE person_id = $1 and work_id = $2
`,
				values: [personId, workId]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}
}