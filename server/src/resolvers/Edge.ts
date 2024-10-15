import { DatabaseConnection } from '../datasources/database';
import { Edge } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		Edge: async (_, { id }): Promise<Edge> => {
			const coreFields = await db.edges.getEdge(id);

			return {
				...coreFields,
				// The rest of the fields for the Edge type become available here as if by magic
				// because the Query type in the schema expects the Edge type and so will use the Edge resolver below
			};
		}
	},
	Edge: {
		id: async (edge: Edge) => {
			return db.edges.getIdForEdge(id);
		},
		title: async (edge: Edge) => {
			return db.edges.getTitleForEdge(edge.id);
		},
		nodes: async (edge: Edge) => {
			return db.edges.getNodesForEdge(edge.id);
		},
	}
};
