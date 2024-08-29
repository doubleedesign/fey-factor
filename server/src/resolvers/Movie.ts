import { DatabaseConnection } from '../datasources/database';
import { Movie } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		Movie: async (_, { id }): Promise<Movie> => {
			const coreFields = await db.works.getMovie(id);

			return {
				...coreFields,
				// The rest of the fields for the Movie type become available here as if by magic
				// because the Query type in the schema expects the Movie type and so will use the Movie resolver below
			};
		}
	},
	Movie: {
		id: async (movie: Movie) => {
			return movie.id;
		},
		title: async (movie: Movie) => {
			return movie.title;
		},
		release_year: async (movie: Movie) => {
			return movie.release_year;
		},
		people: async (movie: Movie) => {
			return db.works.getPeopleForMovie(movie.id);
		},
		roles: async (movie: Movie & { personId?: number }) => {
			if(movie.personId) {
				return db.works.getPersonsRolesForWork(movie.personId, movie.id);
			}

			return db.works.getRolesForMovie(movie.id);
		},
	}
};
