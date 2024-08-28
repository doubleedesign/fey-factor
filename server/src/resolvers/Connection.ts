import { DatabaseConnection } from '../datasources/database';
import { Connection } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Connection: {
		id: async (connection: Connection) => {
			return connection.id;
		},
		person_id: async (connection: Connection) => {
			return connection.person_id;
		},
		work_id: async (connection: Connection) => {
			return connection.work_id;
		},
		role_id: async (connection: Connection) => {
			return connection.role_id;
		},
		episode_count: async (connection: Connection) => {
			return connection.episode_count;
		},
		person: async (connection: Connection) => {
			return db.connections.getPersonForConnection(connection.id);
		},
		work: async (connection: Connection) => {
			return db.connections.getWorkForConnection(connection.id);
		},
		role: async (connection: Connection) => {
			return db.connections.getRoleForConnection(connection.id);
		},
	}
};
