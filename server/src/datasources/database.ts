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
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM people WHERE id = $1',
				values: [id]
			});
			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);
			return null;
		}
	}

	async getConnectionsForPerson(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM connections WHERE person_id = $1',
				values: [id]
			});
			return response.rows;
		}
		catch(error) {
			console.error(error);
			return null;
		}
	}

	async getWorksForPerson(id: number) {
		try {
			const tvShows = await this.getTvShowsForPerson(id);
			const movies = await this.getMoviesForPerson(id);
			return [...tvShows, ...movies];
		}
		catch(error) {
			console.error(error);
			return null;
		}
	}

	async getTvShowsForPerson(id: number) {
		try {
			const response = await this.pgClient.query({
				text: `SELECT w.*, t.start_year, t.end_year, t.episode_count, t.season_count
                       FROM public.works w JOIN public.tv_shows t ON t.id = w.id
                       WHERE w.type = 'TV'
                         AND w.id IN (SELECT work_id FROM public.connections WHERE person_id = $1)
				`,
				values: [id]
			});
			return response.rows;
		}
		catch(error) {
			console.error(error);
			return null;
		}
	}

	async getMoviesForPerson(id: number) {
		try {
			const response = await this.pgClient.query({
				text: `SELECT w.*, t.release_year
                       FROM public.works w JOIN public.movies t ON t.id = w.id
                       WHERE w.type = 'FILM'
                         AND w.id IN (SELECT work_id FROM public.connections WHERE person_id = $1)
				`,
				values: [id]
			});
			return response.rows;
		}
		catch(error) {
			console.error(error);
			return null;
		}
	}

	async getRolesForPerson(id: number) {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM roles WHERE id IN (SELECT role_id FROM connections WHERE person_id = $1)',
				values: [id]
			});
			return response.rows;
		}
		catch(error) {
			console.error(error);
			return null;
		}
	}


	async getTvShow(id: number) {
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

	async getConnectionsForTvshow(id: number) {
		return this.getConnectionsForWork(id);
	}

	async getConnectionsForMovie(id: number) {
		return this.getConnectionsForWork(id);
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

	async getPeopleForTvshow(id: number) {
		return this.getPeopleForWork(id);
	}

	async getPeopleForMovie(id: number) {
		return this.getPeopleForWork(id);
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

	async getRolesForTvshow(id: number) {
		return this.getRolesForWork(id);
	}

	async getRolesForMovie(id: number) {
		return this.getRolesForWork(id);
	}

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
