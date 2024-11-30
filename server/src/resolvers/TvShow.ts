import { DatabaseConnection } from '../datasources/database';
import type { TvShow as TvShowGql } from '../generated/gql-types-reformatted';
import pick from 'lodash/pick';
import { TmdbApiConnection } from '../datasources/tmdb';
import { convertIdToInteger } from '../utils';

const db = new DatabaseConnection();
const api = new TmdbApiConnection();

export default {
	Query: {
		TvShow: async (_, { id }): Promise<TvShowGql> => {
			const coreFields = await db.works.getTvShow(id);
			const ranking_data = await db.works.getRankingDataForTvshow(id);

			return {
				...coreFields,
				id: convertIdToInteger(coreFields.id),
				ranking_data: ranking_data
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
				ranking_data: {
					...pick(tvShow, ['total_connections', 'average_degree', 'aggregate_episode_count', 'weighted_score'])
				},
			}));
		},
	},
	TvShow: {
		people: async (parent: TvShowGql) => {
			return db.works.getPeopleForTvShow(parent.id);
		},
		// TODO: Make Roles field more useful for Works, or remove it
		roles: async (parent: TvShowGql & { personId?: number }) => {
			if (parent.personId) {
				return db.works.getPersonsRolesForWork(parent.personId, parent.id, 'T');
			}

			return db.works.getRolesForTvshow(parent.id);
		},
		ranking_data: async (parent: TvShowGql) => {
			if(!parent?.ranking_data) {
				return await db.works.getRankingDataForTvshow(parent.id);
			}

			return pick(parent, ['total_connections', 'average_degree', 'aggregate_episode_count', 'weighted_score']);
		},
		providers: async (parent: TvShowGql, { filter }) => {
			try {
				const allResults = await api.getWatchProviders(parent.id);

				if(filter.provider_type) {
					return allResults.filter(result => filter.provider_type.includes(result.provider_type));
				}

				return allResults;
			}
			catch(error) {
				console.error('Error fetching watch providers:', error);

				return [];
			}
		},
		// TODO: If I query for the overview, backdrop_path, and poster_path at the same time,
		//  presumably that will make 3 identical API requests and should be cached or something.
		overview: async (parent: TvShowGql) => {
			const details = await api.getTvShowDetails(parent.id);

			return details?.overview ?? '';
		},
		backdrop_path: async (parent: TvShowGql) => {
			const details = await api.getTvShowDetails(parent.id);

			return details?.backdrop_path ?? '';
		},
		poster_path: async (parent: TvShowGql) => {
			const details = await api.getTvShowDetails(parent.id);

			return details?.poster_path ?? '';
		},
	},
};
