// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { DatabaseConnection } from '../datasources/database';
import { Template } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		template: async (_, { id }) => {
			return db.getTemplate(id);
		}
	},
	Template: {}
};
