import pg from 'pg';
import { Movie, Person, Role, TvShow } from '../../generated/source-types';
import { RankingData } from '../../types';

type TvShowWithRankingData = TvShow & RankingData;

export class DbWorks  {
	constructor(private pgClient: pg.Pool) {}

	async getTvShow(id: number): Promise<TvShow> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT tv_shows.id,
                              COALESCE(tv_shows.title, works.title) AS title,
                              start_year,
                              end_year,
                              season_count,
                              episode_count
                       FROM tv_shows
                                LEFT JOIN
                            works ON tv_shows.id = works.id
                       WHERE tv_shows.id = $1;
`,
				values: [id]
			});

			return response.rows[0] ?? null;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getTvShows(ids: number[]): Promise<TvShow[]> {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM tv_shows WHERE id = ANY($1)',
				values: [ids]
			});

			return response.rows;
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

	async getMovies(ids: number[]): Promise<Movie[]> {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM movies WHERE id = ANY($1)',
				values: [ids]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getPeopleForWork(id: number): Promise<Person[]> {
		try {
			// Get people ordered by aggregate episode count for this show,
			// followed by their total connection count across the database
			const response = await this.pgClient.query({
				text: `SELECT
                           people.id,
                           people.name,
                           people.degree,
                           SUM(CASE WHEN connections.work_id = 4608 THEN connections.episode_count ELSE 0 END) AS aggregate_episode_count,
                           COUNT(DISTINCT CASE WHEN connections.work_id != $1 THEN connections.work_id END) AS other_works_count
                       FROM 
                           people
                           JOIN
                           connections ON people.id = connections.person_id
                       WHERE
                           people.id IN (SELECT person_id FROM connections WHERE work_id = $1)
                       GROUP BY
                           people.id, people.name, people.degree
                       HAVING
                           COUNT(DISTINCT CASE WHEN connections.work_id != $1 THEN connections.work_id END) > 1
                       ORDER BY
                           aggregate_episode_count DESC,
                           other_works_count DESC
						`,
				values: [id]
			});

			return response.rows.map(row => ({
				id: row.id,
				name: row.name,
				degree: row.degree
			}));
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

	async getPersonsRolesForWork(personId: number, workId: number): Promise<Role[]> {
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

	/**
	 * Get a list of tv shows ranked by a weighted score
	 * based on number of connections, how many episodes each connection has, and the average degree of all the connected people
	 * Shows with fewer than 2 connections are excluded
	 * @param limit
	 */
	async getRankedListOfTvShows(limit: number): Promise<TvShowWithRankingData[]> {
		try {
			const response = await this.pgClient.query({
				text:`
                    WITH aggregated_data as (SELECT tv_shows.id,
                                                    works.title                               AS title,
                                                    tv_shows.episode_count,
                                                    COUNT(connections.person_id)::INTEGER     AS total_connections,
                                                    ROUND(AVG(people.degree), 2)::DECIMAL     AS average_degree,
                                                    2 - ROUND(AVG(people.degree), 2)::DECIMAL AS inverted_average_degree,
                                                    SUM(connections.episode_count)::INTEGER   AS aggregate_episode_count
                                             FROM tv_shows
                                                      INNER JOIN
                                                  connections ON tv_shows.id = connections.work_id
                                                      INNER JOIN
                                                  people ON connections.person_id = people.id
                                                      INNER JOIN
                                                  works ON tv_shows.id = works.id
                                             WHERE works.title IS NOT NULL
                                             GROUP BY tv_shows.id, works.title, tv_shows.episode_count
                                             ORDER BY inverted_average_degree DESC,
                                                      total_connections DESC)
                    SELECT
                        ad.id,
                        ad.title,
                        ad.episode_count,
                        ts.start_year,
                        ts.end_year,
                        ts.season_count,
                        ad.total_connections,
                        ad.average_degree,
                        ad.aggregate_episode_count,
                        ROUND((ad.aggregate_episode_count / ad.episode_count) * ad.inverted_average_degree, 2)::DECIMAL AS weighted_score
                    FROM
                        aggregated_data ad
                            INNER JOIN
                        tv_shows ts ON ad.id = ts.id
                    WHERE
                        ad.aggregate_episode_count > 0
                    	AND ad.total_connections > 1
                    ORDER BY
                        weighted_score DESC
                    LIMIT $1;
				`,
				values: [limit]
			});

			return response.rows;
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}

	async getRankingDataForTvshow(id: number): Promise<RankingData> {
		try {
			const response = await this.pgClient.query({
				text:`
					WITH aggregated_data as (SELECT tv_shows.id,
						   works.title                               AS title,
						   tv_shows.episode_count,
						   COUNT(connections.person_id)::INTEGER     AS total_connections,
						   ROUND(AVG(people.degree), 2)::DECIMAL     AS average_degree,
						   2 - ROUND(AVG(people.degree), 2)::DECIMAL AS inverted_average_degree,
						   SUM(connections.episode_count)::INTEGER   AS aggregate_episode_count
					FROM tv_shows
							 INNER JOIN
						 connections ON tv_shows.id = connections.work_id
							 INNER JOIN
						 people ON connections.person_id = people.id
							 INNER JOIN
						 works ON tv_shows.id = works.id
					WHERE works.title IS NOT NULL AND tv_shows.id = $1
					GROUP BY tv_shows.id, works.title, tv_shows.episode_count
					ORDER BY inverted_average_degree DESC,
							 total_connections DESC)
					SELECT 
					    ad.total_connections,
					    ad.average_degree,
					    ad.aggregate_episode_count,
					    ROUND((ad.aggregate_episode_count / ad.episode_count) * ad.inverted_average_degree, 2)::DECIMAL AS weighted_score
					FROM
					    aggregated_data ad
					WHERE
					    ad.aggregate_episode_count > 0
				`,
				values: [id]
			});

			return response.rows[0];
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}
}
