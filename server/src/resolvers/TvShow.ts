import { DatabaseConnection } from '../datasources/database';
import { TvShow } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		TvShow: async (_, { id }): Promise<TvShow> => {
			const coreFields = await db.works.getTvShow(id);

			return {
				...coreFields,
				// The rest of the fields for the TvShow type become available here as if by magic
				// because the Query type in the schema expects the TvShow type and so will use the TvShow resolver below
			};
		}
	},
	TvShow: {
		id: async (tvshow: TvShow) => {
			return tvshow.id;
		},
		title: async (tvshow: TvShow) => {
			return tvshow.title;
		},
		start_year: async (tvshow: TvShow) => {
			return tvshow.start_year;
		},
		end_year: async (tvshow: TvShow) => {
			return tvshow.end_year;
		},
		season_count: async (tvshow: TvShow) => {
			return tvshow.season_count;
		},
		episode_count: async (tvshow: TvShow) => {
			return tvshow.episode_count;
		},
		people: async (tvshow: TvShow) => {
			return db.works.getPeopleForTvshow(tvshow.id);
		},
		roles: async (parent: TvShow & { personId?: number }, args, context) => {
			if(parent.personId) {
				return await db.works.getPersonsRolesForWork(parent.personId, parent.id);
			}

			return await db.works.getRolesForTvshow(parent.id);
		},
	}
};
