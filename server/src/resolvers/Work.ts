import { DatabaseConnection } from '../datasources/database';
import { Work } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Work: {
		__resolveType(work) {
			if (work.type === 'TV') {
				return 'TvShow';
			}
			if (work.type === 'FILM') {
				return 'Movie';
			}
			return null;
		}
	}
};
