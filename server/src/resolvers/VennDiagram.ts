import { DatabaseConnection } from '../datasources/database';
import { VennDiagram, VennDiagramSet } from '../generated/gql-types-reformatted';
const db = new DatabaseConnection();

export default {
	Query: {
		VennDiagram: async (_, { maxAverageDegree, minConnections }): Promise<VennDiagram> => {
			// { maxAverageDegree: 1.5, minConnections: 3 }
			const sets: VennDiagramSet[] = await db.venn.getPeopleAndTheirShows({ maxAverageDegree, minConnections });

			return { data: sets };
		}
	},
};
