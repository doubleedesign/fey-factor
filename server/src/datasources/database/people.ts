import pg from 'pg';

export class DbPeople {
	constructor(private pgClient: pg.Pool) {}

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
                       WHERE w.id IN (SELECT work_id FROM public.connections WHERE person_id = $1)
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
                       WHERE w.id IN (SELECT work_id FROM public.connections WHERE person_id = $1)
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
}