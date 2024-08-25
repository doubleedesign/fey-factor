import { DatabaseConnection } from '../datasources/database';
import { Movie } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		movie: async (_, { id }) => {
			return db.works.getMovie(id);
		}
	},
	Movie: {
		connections: async (movie: Movie) => {
			return db.works.getConnectionsForMovie(movie.id);
		},
		people: async (movie: Movie) => {
			return db.works.getPeopleForMovie(movie.id);
		},
		roles: async (movie: Movie) => {
			return db.works.getRolesForMovie(movie.id);
		}, 
	},
	MovieContainer: {
		movie: async (id) => {
			return db.works.getMovie(id);
		}
	}
};
