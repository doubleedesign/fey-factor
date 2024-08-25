import { DatabaseConnection } from '../datasources/database';
import { Connection } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		connection: async (_, { id }) => {
			return db.connections.getConnection(id);
		}
	},
	Connection: {
		person: async (connection: Connection) => {
			return db.connections.getPersonForConnection(connection.id);
		},
		work: async (connection: Connection) => {
			return db.connections.getWorkForConnection(connection.id);
		},
		role: async (connection: Connection) => {
			return db.connections.getRoleForConnection(connection.id);
		}, 
	},
	ConnectionContainer: {
		connection: async (id) => {
			return db.connections.getConnection(id);
		}
	}
};
