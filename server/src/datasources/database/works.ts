import pg from 'pg';
import { Person, Role } from '../../generated/source-types';
import { Movie, TvShow, WorkRankingData } from '../../generated/gql-types-reformatted';
import { convertIdToInteger, convertIdToString } from '../../utils';

export class DbWorks  {
	constructor(private pgClient: pg.Pool) {}

	async getTvShow(id: number): Promise<TvShow> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT tv_shows.id,
                              tv_shows.title,
                              start_year,
                              end_year,
                              season_count,
                              episode_count
                       FROM tv_shows
                                LEFT JOIN
                            works ON tv_shows.id = works.id
                       WHERE tv_shows.id = $1;
`,
				values: [convertIdToString(id, 'T')]
			});

			return response.rows[0] ? {
				...response.rows[0],
				id: convertIdToInteger(response.rows[0].id),
			} : null;
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

			return response.rows.map(row => ({
				...row,
				id: convertIdToInteger(row.id),
			}));
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

			return response.rows[0] ? {
				...response.rows[0],
				id: convertIdToInteger(response.rows[0].id),
			} : null;
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

			return response.rows.map(row => ({
				...row,
				id: convertIdToInteger(row.id),
			}));
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	/**
	 * Get people linked to a TV show, ordered with lower degree first,
	 * then ordered by the person's total connection count across the database,
	 * followed by their aggregate episode count for this show
	 * Note: Like for ranking data, people at degree > 1 connected to only one work are excluded.
	 * @param id - ID of the TV show.
	 *
	 * TODO This shows a potential issue with the current data builder logic.
	 * Naomi Ekperigin is a degree 1 because she wrote for Girls5Eva, but not enough to be connected to that, so her other_work_count is 0.
	 */
	async getPeopleForTvShow(id: number): Promise<Person[]> {
		try {
			const response = await this.pgClient.query({
				text: `
			        WITH person_connections AS (
			            SELECT 
			                person_id,
			                COUNT(DISTINCT work_id) AS total_works
			            FROM 
			                connections
			            GROUP BY 
			                person_id
			        )
			        SELECT
			            people.id,
			            people.name,
			            people.degree,
			            SUM(CASE WHEN connections.work_id = $1 THEN connections.episode_count ELSE 0 END) AS aggregate_episode_count,
			            COUNT(DISTINCT CASE WHEN connections.work_id != $1 THEN connections.work_id END) AS other_works_count
			        FROM 
			            people
			            JOIN connections ON people.id = connections.person_id
			            JOIN person_connections pc ON people.id = pc.person_id
			        WHERE
			            people.id IN (SELECT person_id FROM connections WHERE work_id = $1)
			            AND (people.degree <= 1 OR (people.degree > 1 AND pc.total_works >= 2))
			        GROUP BY
			            people.id, people.name, people.degree
                    HAVING
                        people.degree <= 1 OR
                        --- Exclude people at degree > 1 connected to only one work (this is the same as other_works_count, we just can't use that here)
                        (people.degree > 1 AND COUNT(DISTINCT CASE WHEN connections.work_id != $1 THEN connections.work_id END) > 0)
			        ORDER BY
			            degree ASC,
                        other_works_count DESC,
			            aggregate_episode_count DESC
			    `,
				values: [convertIdToString(id, 'T')]
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

	async getRolesForWork(id: number, workType: 'T' | 'F'): Promise<Role[]> {
		try {
			const response = await this.pgClient.query({
				text: 'SELECT * FROM roles WHERE id IN (SELECT role_id FROM connections WHERE work_id = $1)',
				values: [convertIdToString(id, workType)]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getRolesForTvshow(id: number): Promise<Role[]> {
		return this.getRolesForWork(id, 'T');
	}

	async getRolesForMovie(id: number): Promise<Role[]> {
		return this.getRolesForWork(id, 'F');
	}

	async getPersonsRolesForWork(personId: number, workId: number, workType: 'T' | 'F'): Promise<Role[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT role_id, roles.name, episode_count FROM connections
                              JOIN roles ON connections.role_id = roles.id
                              WHERE person_id = $1 and work_id = $2
`,
				values: [personId, convertIdToString(workId, workType)]
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
	async getRankedListOfTvShows(limit: number): Promise<TvShow[]> {
		try {
			const response = await this.pgClient.query({
				text: `
                    WITH filtered_connections AS (
						SELECT
						    c.person_id, c.work_id, c.episode_count
						FROM 
						    connections c
						JOIN
					        people p ON c.person_id = p.id
						WHERE 
						    --- Include all degree 0-1 people
						    p.degree <= 1 
						    --- Include degree 2 people associated with more than 1 work
					   		OR (p.degree > 1 AND (SELECT COUNT(DISTINCT work_id) FROM connections WHERE person_id = c.person_id) > 1)
					),
                    --- end of filtered_connections definition
                    aggregated_data AS (
						SELECT 
					    	tv_shows.id,
							works.title AS title,
							tv_shows.episode_count,
							COUNT(DISTINCT fc.person_id)::INTEGER     AS total_connections,
							ROUND(AVG(people.degree), 2)::DECIMAL     AS average_degree,
							2 - ROUND(AVG(people.degree), 2)::DECIMAL AS inverted_average_degree,
							SUM(fc.episode_count)::INTEGER            AS aggregate_episode_count
						FROM 
						 	tv_shows
						INNER JOIN filtered_connections fc ON tv_shows.id = fc.work_id
						INNER JOIN people ON fc.person_id = people.id
						INNER JOIN works ON tv_shows.id = works.id
						WHERE 
						    works.title IS NOT NULL
							AND tv_shows.id != '1667_T' -- exclude SNL
						GROUP BY 
						    tv_shows.id, works.title, tv_shows.episode_count
						ORDER BY 
						    inverted_average_degree DESC, total_connections DESC
					)
                    --- end of aggregated_data definition
                    SELECT ad.id,
                           ad.title,
                           ad.episode_count,
                           ts.start_year,
                           ts.end_year,
                           ts.season_count,
                           ad.total_connections,
                           ad.average_degree,
                           ad.aggregate_episode_count,
                           ROUND((ad.aggregate_episode_count / ad.episode_count) * ad.inverted_average_degree, 2)::DECIMAL AS weighted_score
                    FROM aggregated_data ad
                             INNER JOIN tv_shows ts ON ad.id = ts.id
                    WHERE 
                        ad.aggregate_episode_count > 0 AND ad.total_connections > 1
                    ORDER BY 
                        weighted_score DESC
                    LIMIT $1;
				`,
				values: [limit]
			});

			return response.rows.map(row => ({
				...row,
				id: convertIdToInteger(row.id),
			}));
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}

	/**
	 * Get the ranking data for an individual tv show
	 * @param id
	 */
	async getRankingDataForTvshow(id: number): Promise<WorkRankingData> {
		try {
			const response = await this.pgClient.query({
				text: `
			        WITH filtered_connections AS (
			            SELECT
			                c.person_id, c.work_id, c.episode_count
			            FROM 
			                connections c
			            JOIN
			                people p ON c.person_id = p.id
			            WHERE 
			                --- Include all degree 0-1 people
			                p.degree <= 1 
			                --- Include degree 2 people associated with more than 1 work
			                OR (p.degree > 1 AND (SELECT COUNT(DISTINCT work_id) FROM connections WHERE person_id = c.person_id) > 1)
			        ),
			        --- end of filtered_connections definition
			        aggregated_data AS (
			            SELECT 
			                tv_shows.id,
			                works.title AS title,
			                tv_shows.episode_count,
			                COUNT(DISTINCT fc.person_id)::INTEGER     AS total_connections,
			                ROUND(AVG(people.degree), 2)::DECIMAL     AS average_degree,
			                2 - ROUND(AVG(people.degree), 2)::DECIMAL AS inverted_average_degree,
			                SUM(fc.episode_count)::INTEGER            AS aggregate_episode_count
			            FROM 
			                tv_shows
			            INNER JOIN filtered_connections fc ON tv_shows.id = fc.work_id
			            INNER JOIN people ON fc.person_id = people.id
			            INNER JOIN works ON tv_shows.id = works.id
			            WHERE 
			                works.title IS NOT NULL
			            GROUP BY 
			                tv_shows.id, works.title, tv_shows.episode_count
			        )
			        --- end of aggregated_data definition
			        SELECT ad.id,
			               ad.title,
			               ad.episode_count,
			               ts.start_year,
			               ts.end_year,
			               ts.season_count,
			               ad.total_connections,
			               ad.average_degree,
			               ad.aggregate_episode_count,
			               ROUND((ad.aggregate_episode_count / ad.episode_count) * ad.inverted_average_degree, 2)::DECIMAL AS weighted_score
			        FROM aggregated_data ad
			                 INNER JOIN tv_shows ts ON ad.id = ts.id
			        WHERE 
			            ad.aggregate_episode_count > 0 
			            AND ad.total_connections > 1
			            AND ad.id = $1;
			    `,
				values: [convertIdToString(id, 'T')]
			});

			return response.rows[0];
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}
}
