import { DatabaseConnection } from '../datasources/database';
import { VennDiagram, VennDiagramSet } from '../generated/gql-types-reformatted';
const db = new DatabaseConnection();

export default {
	Query: {
		VennDiagram: async (_, { maxAverageDegree, minConnections, roleIds }): Promise<VennDiagram> => {
			const sets: VennDiagramSet[] = await db.venn.getShowsAndTheirPeople({ maxAverageDegree, minConnections, roleIds });

			return { data: sets };
		}
	},
};
