import { DatabaseConnection } from '../datasources/database';
import { Node, Edge } from '../generated/gql-types-reformatted';
import EdgeResolver from './Edge';

const db = new DatabaseConnection();

export default {
	Query: {
		Node: async (_, { id }): Promise<Node> => {
			const person = await db.people.getPerson(id);
			const edges = await db.network.getEdgesForPersonNode(id, 'T');

			return { ...person, edges };
		},
		nodes: async (_, { edgeId }): Promise<Node[]> => {
			return await db.network.getPersonNodesForTvShowEdge(edgeId);
		}
	},
	Node: {
		id: (node: Node) => node.id,
		name: (node: Node) => node.name,
		degree: (node: Node) => node.degree,
		edges: async (node: Node): Promise<Edge[]> => {
			return EdgeResolver.Query.edges(null, { nodeId: node.id });
		},
	}
};
