import { DatabaseConnection } from '../datasources/database';
import type { Movie } from '../generated/gql-types-reformatted';
import pick from 'lodash/pick';
import { convertIdToInteger } from '../utils';

const db = new DatabaseConnection();

export default {
	Query: {
		Movie: async (_, { id }): Promise<Movie> => {
			const coreFields = await db.works.getMovie(id);

			return {
				...coreFields,
				id: convertIdToInteger(coreFields.id),
			};
		},
		Movies: async (_, { ids, limit }): Promise<Movie[]> => {
			if (ids && ids.length > 0) {
				return await db.works.getMovies(ids);
			}

			console.log('Not implemented yet');

			return [];

			// const result = await db.works.getRankedListOfMovies(limit);
			//
			// return result.map(Movie => {
			// 	console.log(Movie);
			//
			// 	return ({
			// 		...Movie,
			// 		ranking_data: {
			// 			...pick(Movie, ['total_connections', 'average_degree', 'aggregate_episode_count', 'weighted_score'])
			// 		},
			// 	});
			// });
		},
	},
	Movie: {
		people: async (parent: Movie) => {
			console.error('Not implemented yet');

			return [];
		},
		// TODO: Make Roles field more useful for Works, or remove it
		roles: async (parent: Movie & { personId?: number }) => {
			if (parent.personId) {
				return db.works.getPersonsRolesForWork(parent.personId, parent.id, 'F');
			}

			return db.works.getRolesForMovie(parent.id);
		},
		// TODO: Implement the database stuff that will make this work
		ranking_data: async (parent: Movie) => {
			return pick(parent, ['total_connections', 'average_degree', 'weighted_score']);
		},
	},
};
