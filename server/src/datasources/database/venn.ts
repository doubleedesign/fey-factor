import pg from 'pg';
import { type VennDiagramSet } from '../../types';

export class DbVenn {
	constructor(private pgClient: pg.Pool) {
	}

	/**
	 * Get people and their shows in a single query, filtering shows based on criteria
	 * and only including people who worked in the specified roles
	 */
	async getPeopleAndTheirShows({ maxAverageDegree, minConnections, roleIds }): Promise<VennDiagramSet[]> {
		const query = {
			text: `
                    WITH eligible_shows AS (
                        -- First identify shows meeting the degree and connection criteria
                        SELECT tv_shows.id AS show_id,
                               tv_shows.title
                            FROM
                                tv_shows
                                    JOIN connections c ON tv_shows.id = c.work_id
                                    JOIN people p ON c.person_id = p.id
                            WHERE
                                  tv_shows.id NOT LIKE '1667_T' -- exclude SNL
                              AND c.role_id = ANY ($3)
                            GROUP BY
                                tv_shows.id,
                                tv_shows.title
                            HAVING
                                  ROUND(AVG(p.degree), 2) <= $1
                              AND COUNT(DISTINCT c.person_id) >= $2
                        ),
                         -- Then get all people and their shows, but only for eligible shows
                         person_shows   AS (
                        SELECT p.id,
                               p.name,
                               es.title
                            FROM
                                people p
                                    JOIN connections c ON p.id = c.person_id
                                    JOIN eligible_shows es ON c.work_id = es.show_id
                            WHERE
                                c.role_id = ANY ($3)
                        )
                    SELECT id,
                           name,
                           ARRAY_AGG(DISTINCT title ORDER BY title) AS sets
                        FROM person_shows
                        GROUP BY
                            id,
                            name
                        HAVING
                            COUNT(DISTINCT title) > 1
                        ORDER BY
                            ARRAY_LENGTH(ARRAY_AGG(DISTINCT title), 1) DESC,
                            name
				`,
			values: [maxAverageDegree, minConnections, roleIds]
		};

		const response = await this.pgClient.query(query);

		return response.rows;
	}

	async getShowsAndTheirPeople({ maxAverageDegree, minConnections, roleIds }): Promise<VennDiagramSet[]> {
		const query = {
			text: `
                    WITH eligible_shows AS (
                        -- First identify shows meeting the degree and connection criteria
                        SELECT tv_shows.id AS show_id,
                               tv_shows.title
                            FROM
                                tv_shows
                                    JOIN connections c ON tv_shows.id = c.work_id
                                    JOIN people p ON c.person_id = p.id
                            WHERE
                                  tv_shows.id NOT LIKE '1667_T' -- exclude SNL
                              AND c.role_id = ANY ($3)
                            GROUP BY
                                tv_shows.id,
                                tv_shows.title
                            HAVING
                                  ROUND(AVG(p.degree), 2) <= $1
                              AND COUNT(DISTINCT c.person_id) >= $2
                        ),
                         -- Then get the people connected to those shows within the relevant parameters
                         person_shows   AS (
                        SELECT p.id,
                               p.name,
                               es.show_id
                            FROM
                                people p
                                    JOIN connections c ON p.id = c.person_id
                                    JOIN eligible_shows es ON c.work_id = es.show_id
                            WHERE
                                c.role_id = ANY ($3)
                        )
                    -- Finally, group by show with people as the set
                    SELECT ps.show_id       AS id,
                           es.title         AS name,
                           ARRAY_AGG(ps.name) AS sets -- Deliberately not DISTINCT to allow weighting where the person has more than one role
                        FROM
                            person_shows ps
                                JOIN eligible_shows es ON ps.show_id = es.show_id
                        GROUP BY
                            es.title, ps.show_id
                        ORDER BY
                            COUNT(ps.name) DESC
				`,
			values: [maxAverageDegree, minConnections, roleIds]
		};

		const response = await this.pgClient.query(query);

		return response.rows;
	}
}