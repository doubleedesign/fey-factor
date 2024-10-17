import { NetworkDiagramQuery$data } from '../__generated__/NetworkDiagramQuery.graphql.ts';
import { GraphProps, GraphLink, GraphNode } from 'react-d3-graph';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';

type Item = {
	id: string;
	name: string;
};

type NodeItem = Item & {
	edges?: EdgeItem[];
};

type EdgeItem = Item & {
	nodes?: NodeItem[];
};

type GraphLinkWithLabel = GraphLink & { label: string };

export const networkWranglers = {
	// Format the data into a standard network configuration where a GraphQL Node is a node and an Edge is an edge/link
	formatStandard: (data: NetworkDiagramQuery$data): GraphProps<GraphNode, GraphLink>['data'] => {
		const nodes: GraphNode[] = [];
		const edges: GraphLink[] = [];

		// Start the recursive processing with the root node
		if (data?.Node) {
			processNode(data.Node as Item, nodes, edges);
		}

		return {
			nodes: uniqBy(nodes, 'id'),
			links: consolidateEdges(edges as GraphLinkWithLabel[])
		};
	},
	// Format the data into a swapped network configuration where a GraphQL Node is an edge/link and an Edge is a node
	formatSwapped: (data: NetworkDiagramQuery$data): GraphProps<GraphNode, GraphLink>['data'] => {
		const nodes: GraphNode[] = [];
		const edges: GraphLink[] = [];

		data?.Node?.edges?.forEach(edge => {
			processEdgeAsNode(edge as EdgeItem, nodes, edges);
		});

		return {
			nodes: uniqBy(nodes, 'id'),
			links: consolidateEdges(edges as GraphLinkWithLabel[])
		};
	}
};

// Recursive helper functions
function processNode(node: NodeItem, nodesArray: GraphNode[], edgesArray: GraphLink[]) {
	if (!node?.id) return;

	// Check if the node already exists in the nodes array
	if (!nodesArray.some(n => n.id === node.id)) {
		nodesArray.push(node);
	}

	// Process each edge linked to this node
	node.edges?.forEach((edge: EdgeItem) => {
		const targetNode = edge?.nodes?.[0];
		if (targetNode?.id) {
			// If the target node doesn't exist, add it
			if (!nodesArray.some(n => n.id === targetNode.id)) {
				nodesArray.push(targetNode);
			}

			// Add the edge, ensuring no self-loops
			if (node.id !== targetNode.id) {
				edgesArray.push({
					source: node.id,
					target: targetNode.id,
					// @ts-expect-error TS2353: Object literal may only specify known properties, and label does not exist in type GraphLink
					label: edge.name
				});
			}

			// Recursively process the target node to handle nested structures
			processNode(targetNode, nodesArray, edgesArray);
		}
	});
}

function processEdgeAsNode(edge: EdgeItem, nodesArray: GraphNode[], edgesArray: GraphLink[]) {
	if(!edge?.id) return;

	// Check if the edge already exists in the nodes array
	if(!nodesArray.some(n => n.id === edge.id)) {
		nodesArray.push(edge);
	}

	// Process each node, but treat it as an edge
	edge.nodes?.forEach((node: NodeItem) => {
		const targetEdge = node?.edges?.[0];
		if(targetEdge?.id) {
			// If the target edge doesn't exist, add it
			if(!nodesArray.some(n => n.id === targetEdge.id)) {
				nodesArray.push(targetEdge);
			}

			// Add the edge, ensuring no self-loops
			if(edge.id !== targetEdge.id) {
				edgesArray.push({
					source: edge.id,
					target: targetEdge.id,
					// @ts-expect-error TS2353: Object literal may only specify known properties, and label does not exist in type GraphLink
					label: node.name
				});
			}

			// Recursively process the target edge to handle nested structures
			processEdgeAsNode(targetEdge, nodesArray, edgesArray);
		}
	});
}

function consolidateEdges(edges: GraphLinkWithLabel[]): GraphLinkWithLabel[] {
	const initialResult = edges.reduce((acc: GraphLinkWithLabel[], edge) => {
		const match = acc.find(
			(e: GraphLinkWithLabel) => (e.source === edge.source && e.target === edge.target)
		);
		const reverseMatch = acc.find(
			(e: GraphLinkWithLabel) => (e.source === edge.target && e.target === edge.source)
		);

		if(match || reverseMatch) {
			if (match) {
				(match as GraphLinkWithLabel).label += `,${edge.label.trim()}`;
			}
			if (reverseMatch) {
				(reverseMatch as GraphLinkWithLabel).label += `,${edge.label.trim()}`;
			}
		}
		else {
			acc.push(edge);
		}

		return acc;
	}, []);

	return initialResult.map((edge: GraphLinkWithLabel) => {
		const labelsArray = edge.label.split(',');
		edge.label = uniq(labelsArray)?.join(',');

		return edge;
	});
}