// @ts-nocheck
import { DatabaseConnection } from '../datasources/database';
import { Template } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		Template: async (_, { id }): Promise<Template> => {
			const coreFields = await db.getTemplate(id);

			return {
				...coreFields,
				// The rest of the fields for the Template type become available here as if by magic
				// because the Query type in the schema expects the Template type and so will use the Template resolver below
			};
		}
	},
	Template: {}
};
