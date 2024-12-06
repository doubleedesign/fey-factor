import pg from 'pg';
import { Node, Edge } from '../../types';
import { convertIdToString } from '../../utils';

export class DbNetwork {
	constructor(private pgClient: pg.Pool) {
	}

	/**
     * Get the TV show edges for a person node
     * @param personId
     * @param workType
     * @param limit
     */
	async getEdgesForPersonNode(personId: number, workType: 'T' | 'F', limit?: number): Promise<Edge[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT connections.work_id AS id,
                              tv_shows.title
                           FROM
                               connections
                                   INNER JOIN tv_shows
                                   ON connections.work_id = tv_shows.id
                           WHERE
                                 person_id = $1
                             AND work_id LIKE '%' || $2
                           GROUP BY
                               connections.work_id, tv_shows.title
                           ORDER BY
                               SUM(connections.episode_count) DESC
                               ${limit ? 'LIMIT $3' : ''}
                `,
				values: limit ? [personId, workType, limit] : [personId, workType]
			});

			return response.rows;
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}


	/**
     * Get the person nodes for a TV show edge
     * Only gets the people who have more than one unique TV show work_id in the connections table
     * @param id
     */
	async getPersonNodesForTvShowEdge(id: number): Promise<Node[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT people.id,
                              people.name,
                              people.degree
                           FROM
                               people
                                   INNER JOIN connections
                                   ON people.id = connections.person_id
                           WHERE
                                 connections.work_id = $1
                             AND people.id IN (SELECT person_id
                                                   FROM
                                                       connections
                                                   WHERE
                                                       connections.work_id LIKE '%_T'
                                                   GROUP BY person_id
                                                   HAVING
                                                       COUNT(DISTINCT connections.work_id) > 1)
                           GROUP BY
                               people.id, people.name, people.degree
                           ORDER BY
                               SUM(connections.episode_count) DESC;

                `,
				values: [convertIdToString(id, 'T')]
			});

			return response.rows;
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}

	async getSharedPersonNodesForTvShowEdges(id1: number, id2: number): Promise<Node[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT people.id,
                              people.name,
                              people.degree
                           FROM
                               people
                                   INNER JOIN connections
                                   ON people.id = connections.person_id
                           WHERE
                                connections.work_id = $1
                             OR connections.work_id = $2
                           GROUP BY
                               people.id, people.name, people.degree
                           ORDER BY
                               SUM(connections.episode_count) DESC
                `,
				values: [convertIdToString(id1, 'T'), convertIdToString(id2, 'T')]
			});

			return response.rows;
		}
		catch (error) {
			console.error(error);

			return null;
		}
	}
}