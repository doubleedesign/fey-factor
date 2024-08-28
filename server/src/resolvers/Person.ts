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
	Person: {
		id: async (person: Person) => {
			return person.id;
		},
		name: async (person: Person) => {
			return person.name;
		},
		degree: async (person: Person) => {
			return person.degree;
		},
		connections: async (person: Person) => {
			return db.people.getConnectionsForPerson(person.id);
		},
		works: async (person: Person, args, context) => {
			const works = await db.people.getWorksForPerson(person.id);

			return works.map(work => {
				return {
					...work,
					personId: person.id // Add this field for contextual resolving further down the chain
				};
			});
		},
		roles: async (person: Person) => {
			return db.people.getRolesForPerson(person.id);
		},
	}
};
