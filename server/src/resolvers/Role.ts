import { DatabaseConnection } from '../datasources/database';
import { Role } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		role: async (_, { id }) => {
			return db.roles.getRole(id);
		}
	},
	Role: {
		connections: async (role: Role) => {
			return db.roles.getConnectionsForRole(role.id);
		},
		people: async (role: Role) => {
			return db.roles.getPeopleForRole(role.id);
		},
		works: async (role: Role) => {
			return db.roles.getWorksForRole(role.id);
		}, 
	},
	RoleContainer: {
		role: async (id) => {
			return db.roles.getRole(id);
		}
	}
};
