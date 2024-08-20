import { DatabaseConnection } from '../datasources/database';
import { Person } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		person: async (_, { id }) => {
			return db.getPerson(id);
		}
	},
	Person: {
		connections: async (person: Person) => {
			return db.getConnectionsForPerson(person.id);
		},
		works: async (person: Person) => {
			return db.getWorksForPerson(person.id);
		},
		roles: async (person: Person) => {
			return db.getRolesForPerson(person.id);
		}, 
	},
};
