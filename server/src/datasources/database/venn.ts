import pg from 'pg';
import { type VennDiagramSet } from '../../types';

export class DbVenn {
	constructor(private pgClient: pg.Pool) {
	}

	/**
     * Initially filter shows to include in the Venn diagram because otherwise it's too complex to render
     * @param maxAverageDegree - maximum average degree of the people involved the show
     * @param minConnections - minimum total number of connections a show needs to be included
     *
     * @return {Promise<string[]>} - IDs of the shows meeting the criteria
     */
	async getShowsToInclude({ maxAverageDegree, minConnections, roleIds }): Promise<string[]> {
		try {
			const response = await this.pgClient.query({
				text: `
                    WITH initial_data AS (
                         SELECT tv_shows.id AS show_id,
                                ROUND(AVG(people.degree), 2)::DECIMAL(10, 2) AS average_degree,
                                COUNT(connections.person_id) AS total_connections
                             FROM
                                 tv_shows
                                     LEFT JOIN
                                     connections ON tv_shows.id = connections.work_id
                                     LEFT JOIN
                                     people ON connections.person_id = people.id
                             WHERE
                                 tv_shows.id NOT LIKE '1667_T' -- exclude SNL TODO: Make this a front-end option
                             	AND connections.role_id = ANY ($3)
                             GROUP BY
                                 tv_shows.id
                         )
                    SELECT show_id
                        FROM
                            initial_data
                        WHERE
                              average_degree <= $1
                          AND total_connections >= $2
                        ORDER BY
                            total_connections DESC;

                `,
				values: [maxAverageDegree, minConnections, roleIds]
			});

			return response.rows.map((row) => row.show_id);
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}


	/**
	 * Get the people and the set of TV shows they have worked on
	 * limited by the given criteria
	 */
	async getPeopleAndTheirShows({ maxAverageDegree, minConnections, roleIds }): Promise<VennDiagramSet[]> {
		const showIds = await this.getShowsToInclude({ maxAverageDegree, minConnections, roleIds });

		try {
			const response = await this.pgClient.query({
				text: `
                    SELECT
                        p.name AS name,
                        ARRAY_AGG(DISTINCT ts.title ORDER BY ts.title) AS sets
                        FROM
                            people p
                                JOIN
                                connections c ON p.id = c.person_id
                                JOIN
                                tv_shows ts ON c.work_id = ts.id
                        WHERE
                            ts.id = ANY ($1::text[])
                
                        GROUP BY
                            p.id, p.name
                        HAVING
                            COUNT(DISTINCT ts.title) > 1 -- Filter out sets with only one show
                        ORDER BY
                            array_length(ARRAY_AGG(DISTINCT ts.title), 1) DESC, -- Order by set size descending
                            p.name; -- then by name
				`,
				values: [showIds]
			});

			return response.rows;
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}
}