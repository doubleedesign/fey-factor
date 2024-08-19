import { DatabaseConnection } from '../datasources/database';
import { TvShow } from '../generated/types';
const db = new DatabaseConnection();

export default {
	Query: {
		tvshow: async (_, { id }) => {
			return db.getTvShow(id);
		}
	},
	TvShow: {
		connections: async (tvshow: TvShow) => {
			return db.getConnectionsForTvshow(tvshow.id);
		},
		people: async (tvshow: TvShow) => {
			return db.getPeopleForTvshow(tvshow.id);
		},
		roles: async (tvshow: TvShow) => {
			return db.getRolesForTvshow(tvshow.id);
		}, 
	},
};
