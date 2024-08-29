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
		works: async (person: Person, args, context) => {
			const { type } = args?.filter;
			let works = [];
			if(type && type === 'TvShow') {
				works = await db.people.getTvShowsForPerson(person.id);
			}
			else if(type && type === 'Movie') {
				works = await db.people.getMoviesForPerson(person.id);
			}
			else {
				works = await db.people.getWorksForPerson(person.id);
				console.warn('No valid type filter provided for works, returning all works for person');
			}

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
