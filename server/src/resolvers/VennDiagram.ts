import { DatabaseConnection } from '../datasources/database';
import { VennDiagram } from '../generated/gql-types-reformatted';
import uniq from 'lodash/uniq';
const db = new DatabaseConnection();

export default {
	Query: {
		VennDiagram: async (_, { minShows, minPeople }): Promise<VennDiagram> => {
			const intersections = await db.venn.getIntersections({ minPeople, minShows });
			const showIds = uniq(intersections.map((i) => i.show_ids).flat());
			const circles = await db.venn.getCircles({ showIds });

			return Promise.resolve({
				intersections,
				circles
			});
		}
	},
};
