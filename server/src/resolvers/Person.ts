import { DatabaseConnection } from '../datasources/database';
import { Person } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		Person: async (_, { id }): Promise<Person> => {
			const coreFields = await db.people.getPerson(id);

			return {
				...coreFields,
				// The rest of the fields for the Person type become available here as if by magic
				// because the Query type in the schema expects the Person type and so will use the Person resolver below
			};
		}
	},
	PersonContainer: {
		id: async (person: Person) => {
			return person.id;
		},
		name: async (person: Person) => {
			return person.name;
		},
		degree: async (person: Person) => {
			return person.degree;
		},
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
	}
};
