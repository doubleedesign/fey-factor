import { DatabaseConnection } from '../datasources/database';
import { Person } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		person: async (_, { id }) => {
			return db.people.getPerson(id);
		}
	},
	Person: {
		connections: async (person: Person) => {
			return db.people.getConnectionsForPerson(person.id);
		},
		works: async (person: Person) => {
			return db.people.getWorksForPerson(person.id);
		},
		roles: async (person: Person) => {
			return db.people.getRolesForPerson(person.id);
		}, 
	},
	PersonContainer: {
		person: async (id) => {
			return db.people.getPerson(id);
		}
	}
};
