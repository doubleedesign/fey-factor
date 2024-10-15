import { DatabaseConnection } from '../datasources/database';
import { Node } from '../generated/source-types';
const db = new DatabaseConnection();

export default {
	Query: {
		Node: async (_, { id }): Promise<Node> => {
			const coreFields = await db.nodes.getNode(id);

			return {
				...coreFields,
				// The rest of the fields for the Node type become available here as if by magic
				// because the Query type in the schema expects the Node type and so will use the Node resolver below
			};
		}
	},
	Node: {
		id: async (node: Node) => {
			return db.nodes.getIdForNode(id);
		},
		name: async (node: Node) => {
			return db.nodes.getNameForNode(node.id);
		},
		degree: async (node: Node) => {
			return db.nodes.getDegreeForNode(node.id);
		},
		edges: async (node: Node) => {
			return db.nodes.getEdgesForNode(node.id);
		},
	}
};
