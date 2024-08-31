import { DatabaseConnection } from '../datasources/database';
import { TvShow } from '../generated/source-types';
import { TvShowWithRankingData } from '../types';
const db = new DatabaseConnection();

const tvShowCoreResolvers = {
	id: async (tvshow: TvShow) => tvshow.id,
	title: async (tvshow: TvShow) => tvshow.title,
	people: async (tvshow: TvShow) => db.works.getPeopleForTvshow(tvshow.id),
	roles: async (parent: TvShow & { personId?: number }) => {
		if (parent.personId) {
			return db.works.getPersonsRolesForWork(parent.personId, parent.id);
		}

		return db.works.getRolesForTvshow(parent.id);
	},
};

export default {
	Query: {
		TvShow: async (_, { id }): Promise<TvShow> => {
			const coreFields = await db.works.getTvShow(id);

			return { ...coreFields };
		},
		TvShows: async (_, { ids, limit }): Promise<TvShow[] | TvShowWithRankingData[]> => {
			if (ids && ids.length > 0) {
				return await db.works.getTvShows(ids);
			}

			return await db.works.getRankedListOfTvShows(limit);
		},
	},
	TvShowResult: {
		__resolveType: (parent) => {
			if ((parent as TvShowWithRankingData).weighted_score) {
				return 'TvShowWithRankingData';
			}

			return 'TvShow';
		},
	},
	TvShow: {
		...tvShowCoreResolvers,
		start_year: async (tvshow: TvShow) => tvshow.start_year,
		end_year: async (tvshow: TvShow) => tvshow.end_year,
		season_count: async (tvshow: TvShow) => tvshow.season_count,
		episode_count: async (tvshow: TvShow) => tvshow.episode_count,
	},
	TvShowWithRankingData: {
		...tvShowCoreResolvers,
		total_connections: async (tvshow: TvShowWithRankingData) => tvshow.total_connections,
		average_degree: async (tvshow: TvShowWithRankingData) => tvshow.average_degree,
		weighted_score: async (tvshow: TvShowWithRankingData) => tvshow.weighted_score,
	},
};
