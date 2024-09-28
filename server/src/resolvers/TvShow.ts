import { DatabaseConnection } from '../datasources/database';
import type { TvShow as TvShowGql } from '../generated/gql-types-reformatted';
import pick from 'lodash/pick';
import { TmdbApiConnection } from '../datasources/tmdb';

const db = new DatabaseConnection();
const api = new TmdbApiConnection();

export default {
	Query: {
		TvShow: async (_, { id }): Promise<TvShowGql> => {
			const coreFields = await db.works.getTvShow(id);
			const rankingData = await db.works.getRankingDataForTvshow(id);

			return {
				...coreFields,
				rankingData: rankingData
			};
		},
		TvShows: async (_, { ids, limit }): Promise<TvShowGql[]> => {
			let result = [];
			if (ids && ids.length > 0) {
				result = await db.works.getTvShows(ids);
			}
			else {
				result = await db.works.getRankedListOfTvShows(limit);
			}

			return result.map(tvShow => ({
				...tvShow,
				rankingData: {
					...pick(tvShow, ['total_connections', 'average_degree', 'aggregate_episode_count', 'weighted_score'])
				},
			}));
		},
	},
	TvShow: {
		people: async (parent: TvShowGql) => {
			return db.works.getPeopleForWork(parent.id);
		},
		// TODO: Make Roles field more useful for Works, or remove it
		roles: async (parent: TvShowGql & { personId?: number }) => {
			if (parent.personId) {
				return db.works.getPersonsRolesForWork(parent.personId, parent.id);
			}

			return db.works.getRolesForTvshow(parent.id);
		},
		rankingData: async (parent: TvShowGql) => {
			if(!parent?.rankingData) {
				return await db.works.getRankingDataForTvshow(parent.id);
			}

			return pick(parent, ['total_connections', 'average_degree', 'aggregate_episode_count', 'weighted_score']);
		},
		providers: async (parent: TvShowGql) => {
			return await api.getWatchProviders(parent.id);
		}
	},
};
