import pg from 'pg';
import { Node, Edge } from '../../types';
import { convertIdToString } from '../../utils';

export class DbNetwork {
	constructor(private pgClient: pg.Pool) {}

	async getEdgesForPersonNode(personId: number, workType: 'T' | 'F', limit?: number): Promise<Edge[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT connections.work_id as id,
                              tv_shows.title
                       FROM connections
                                INNER JOIN tv_shows ON connections.work_id = tv_shows.id
                       WHERE person_id = $1
                         AND work_id LIKE '%' || $2
                       GROUP BY connections.work_id, tv_shows.title
                       ORDER BY SUM(connections.episode_count) DESC
                		${limit ? 'LIMIT $3' : ''}
				`,
				values: limit ? [personId, workType, limit] : [personId, workType]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getSharedEdgesForPersonNodes(personId1: number, personId2: number, workType: 'T' | 'F'): Promise<Edge[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT connections.work_id as id,
							  tv_shows.title
					   FROM connections
								INNER JOIN tv_shows ON connections.work_id = tv_shows.id
					   WHERE person_id = $1
						  OR person_id = $2
						 AND work_id LIKE '%' || $3
					   GROUP BY connections.work_id, tv_shows.title
					   ORDER BY SUM(connections.episode_count) DESC;
				`,
				values: [personId1, personId2, workType]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}

	async getPersonNodesForTvShowEdge(id: number, limit?: number): Promise<Node[]> {
		try {
			const response = await this.pgClient.query({
				text: `SELECT people.id,
                              people.name,
                              people.degree
                       FROM people
                                INNER JOIN connections ON people.id = connections.person_id
                       WHERE connections.work_id = $1
                       GROUP BY people.id, people.name, people.degree
                       ORDER BY SUM(connections.episode_count) DESC
                       ${limit ? 'LIMIT $2' : ''}
				`,
				values: limit ? [convertIdToString(id, 'T'), limit] : [convertIdToString(id, 'T')]
			});

			return response.rows;
		}
		catch(error) {
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
					   FROM people
								INNER JOIN connections ON people.id = connections.person_id
					   WHERE connections.work_id = $1
						  OR connections.work_id = $2
					   GROUP BY people.id, people.name, people.degree
					   ORDER BY SUM(connections.episode_count) DESC
				`,
				values: [convertIdToString(id1, 'T'), convertIdToString(id2, 'T')]
			});

			return response.rows;
		}
		catch(error) {
			console.error(error);

			return null;
		}
	}
}