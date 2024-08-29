import { DatabaseConnection } from '../datasources/database';
import { Role } from '../generated/gql-types-reformatted';
const db = new DatabaseConnection();

export default {
	Query: {
		Role: async (_, { id }): Promise<Role> => {
			const coreFields = await db.roles.getRole(id);

			return {
				...coreFields,
				// The rest of the fields for the Role type become available here as if by magic
				// because the Query type in the schema expects the Role type and so will use the Role resolver below
			};
		}
	},
	Role: {
		id: async (role: Role) => {
			return role.id;
		},
		name: async (role: Role) => {
			return role.name;
		},
		episode_count: async (role: Role) => {
			return role?.episode_count ?? null;
		},
	}
};
