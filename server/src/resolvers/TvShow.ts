import { DatabaseConnection } from '../datasources/database';
import { TvShow } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		tvshow: async (_, { id }) => {
			return db.works.getTvShow(id);
		}
	},
	TvShow: {
		connections: async (tvshow: TvShow) => {
			return db.works.getConnectionsForTvshow(tvshow.id);
		},
		people: async (tvshow: TvShow) => {
			return db.works.getPeopleForTvshow(tvshow.id);
		},
		roles: async (tvshow: TvShow) => {
			return db.works.getRolesForTvshow(tvshow.id);
		}, 
	},
	TvShowContainer: {
		tvshow: async (id) => {
			return db.works.getTvShow(id);
		}
	}
};
