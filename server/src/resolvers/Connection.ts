import { DatabaseConnection } from '../datasources/database';
import { Connection } from '../generated/types';
const db = new DatabaseConnection();

export default {
	Query: {
		connection: async (_, { id }) => {
			return db.getConnection(id);
		}
	},
	Connection: {
		person: async (connection: Connection) => {
			return db.getPersonForConnection(connection.id);
		},
		work: async (connection: Connection) => {
			return db.getWorkForConnection(connection.id);
		},
		role: async (connection: Connection) => {
			return db.getRoleForConnection(connection.id);
		}, 
	},
};
