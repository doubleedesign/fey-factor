import { DatabaseConnection } from '../datasources/database';
const db = new DatabaseConnection();

export default {
	Query: {
		person: async (_, { id }) => {
			return db.getPerson(id);
		}
	},
	Person: {
		connections: async (parent) => {
			return db.getConnectionsForPerson(parent.id);
		}
	}
};
