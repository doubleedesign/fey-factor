import { DatabaseConnection } from '../datasources/database';
import { Movie } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		movie: async (_, { id }) => {
			return db.getMovie(id);
		}
	},
	Movie: {
		connections: async (movie: Movie) => {
			return db.getConnectionsForMovie(movie.id);
		},
		people: async (movie: Movie) => {
			return db.getPeopleForMovie(movie.id);
		},
		roles: async (movie: Movie) => {
			return db.getRolesForMovie(movie.id);
		}, 
	},
};
