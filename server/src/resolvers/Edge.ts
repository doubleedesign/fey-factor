import { DatabaseConnection } from '../datasources/database';
import { convertIdToInteger } from '../utils';
import { Node, Edge } from '../generated/gql-types-reformatted';
import NodeResolver from './Node';

const db = new DatabaseConnection();

export default {
	Query: {
		Edge: async({ id }): Promise<Edge> => {
			const show = await db.works.getTvShow(convertIdToInteger(id));
			const nodes = await db.network.getPersonNodesForTvShowEdge(convertIdToInteger(id));

			return { ...show, nodes };
		},
		edges: async(_, { nodeId, limit }): Promise<Edge[]> => {
			// TODO: Exclude edges resolved higher in the tree
			return await db.network.getEdgesForPersonNode(convertIdToInteger(nodeId), 'T', limit);
		}
	},
	Edge: {
		id: (edge: Edge) => edge.id,
		title: (edge: Edge) => edge.title,
		nodes: async (edge: Edge, { limit }): Promise<Node[]> => {
			return NodeResolver.Query.nodes(null, { edgeId: edge.id, limit });
		},
	}
};
