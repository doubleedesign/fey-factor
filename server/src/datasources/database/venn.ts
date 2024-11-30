import pg from 'pg';
import { VennDiagramIntersection, VennDiagramCircle } from '../../types';

export class DbVenn {
	constructor(private pgClient: pg.Pool) {
	}

	async getIntersections({ minShows, minPeople }): Promise<VennDiagramIntersection[]> {
		try {
			const response = await this.pgClient.query({
				text: `
                    WITH person_shows          AS (
                        SELECT person_id,
                               work_id,
                               title
                            FROM
                                connections
                                    JOIN
                                    tv_shows ON connections.work_id = tv_shows.id
                            WHERE
                                work_id LIKE '%_T'
                        ),
                         shows_with_people     AS (
                        SELECT work_id,
                               title,
                               COUNT(DISTINCT person_id) AS total_people
                            FROM
                                person_shows
                            GROUP BY
                                work_id,
                                title
                            HAVING
                                COUNT(DISTINCT person_id) >= $2 -- Exclude shows with fewer than $minPeople
                        ),
                         filtered_person_shows AS (
                        SELECT person_id,
                               work_id,
                               title
                            FROM
                                person_shows
                            WHERE
                                work_id IN (
                                    SELECT work_id
                                        FROM shows_with_people -- Include only shows with $minPeople
                                    ) 
                        ),
                         intersections         AS (
                        SELECT ARRAY_AGG(DISTINCT work_id) AS show_ids,
                               ARRAY_AGG(DISTINCT title)   AS shows,
                               COUNT(*)                    AS total_people
                            FROM
                                filtered_person_shows
                            GROUP BY
                                person_id
                        )
                    SELECT show_ids,
                           shows as titles,
                           total_people AS people_count
                        FROM
                            intersections
                        WHERE
                            CARDINALITY(shows) > $1 -- At least $minShows shows in common
                        ORDER BY
                            total_people DESC; -- Order by the number of people
				`,
				values: [minShows, minPeople]
			});

			return response.rows;
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}

	async getCircles({ showIds }): Promise<VennDiagramCircle[]> {
		try {
			const response = await this.pgClient.query({
				text: `
                    SELECT
                        tv_shows.title AS title,
                        COUNT(DISTINCT connections.person_id) AS people_count
                    FROM
                        connections
                            JOIN
                            tv_shows ON connections.work_id = tv_shows.id
                    WHERE
                        tv_shows.id = ANY ($1::text[])
                    GROUP BY
                        tv_shows.title
                    ORDER BY
                        people_count DESC;
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