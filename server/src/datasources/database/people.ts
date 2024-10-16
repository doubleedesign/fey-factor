import pg from 'pg';
import { Connection, Person, Role } from '../../generated/source-types';
import { Work, Movie, TvShow } from '../../generated/gql-types-reformatted';

export class DbPeople {
	constructor(private pgClient: pg.Pool) {}

	async getPerson(id: number): Promise<Person> {
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

	async getDegreeZero() {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM people WHERE degree = 0'
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getConnectionsForPerson(id: number): Promise<Connection[]> {
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

	async getFilteredConnectionsForPerson(id: number, type: 'T' | 'F'): Promise<Connection[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT *
                       FROM connections
                       WHERE person_id = $1
                         AND work_id LIKE '%' || $2
				`,
				values: [id, type]
			});

			console.log(response.rows);

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getWorksForPerson(id: number): Promise<Work[]> {
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

	async getTvShowsForPerson(id: number): Promise<TvShow[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT DISTINCT ON (w.id) w.id, w.title, t.start_year, t.end_year, t.episode_count, t.season_count
                       FROM public.tv_shows t
                           JOIN public.works w ON t.id = w.id
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

	async getMoviesForPerson(id: number): Promise<Movie[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT DISTINCT ON (w.id) w.*, t.release_year
                       FROM public.works w JOIN public.movies t ON t.id = w.id
                       WHERE w.id IN (SELECT work_id FROM public.connections WHERE person_id = $1)
						AND w.title IS NOT NULL
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

	async getRolesForPerson(id: number): Promise<Role[]> {
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