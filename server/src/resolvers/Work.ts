import { DatabaseConnection } from '../datasources/database';
import { Work } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Work: {
		__resolveType(work) {
			return work.episode_count ? 'TvShow' : 'Movie';
		}
	},
};