import { DatabaseConnection } from '../datasources/database';
import { Role } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		role: async (_, { id }) => {
			return db.getRole(id);
		}
	},
	Role: {
		connections: async (role: Role) => {
			return db.getConnectionsForRole(role.id);
		},
		people: async (role: Role) => {
			return db.getPeopleForRole(role.id);
		},
		works: async (role: Role) => {
			return db.getWorksForRole(role.id);
		}, 
	},
};
