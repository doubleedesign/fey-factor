import { DatabaseConnection } from '../datasources/database';
import { Connection } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		Connection: async (_, { id }): Promise<Connection> => {
			const coreFields = await db.connections.getConnection(id);

			return {
				...coreFields,
				// The rest of the fields for the Connection type become available here as if by magic
				// because the Query type in the schema expects the Connection type and so will use the Connection resolver below
			};
		}
	},
	ConnectionContainer: {
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
	}
};
