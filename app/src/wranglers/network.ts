import { NetworkDiagramQuery$data } from '../__generated__/NetworkDiagramQuery.graphql.ts';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import cytoscape from 'cytoscape';
import { NetworkObject } from '../types.ts';


export const networkWranglers = {
	// Format the data into a standard network configuration where a GraphQL Node is a node and an Edge is an edge/link
	formatStandard: (data: NetworkDiagramQuery$data): NetworkObject => {
		const nodes: cytoscape.NodeDataDefinition[] = [];
		const edges: cytoscape.EdgeDataDefinition[] = [];

		// Start the recursive processing with the root node
		if (data?.Node) {
			processNode(data.Node, nodes, edges);
		}

		console.log(edges);

		return {
			nodes: uniqBy(nodes, 'id').map(node => ({ data: node })),
			edges: consolidateEdges(edges).map(edge => ({ data: edge }))
		};
	},
	// Format the data into a swapped network configuration where a GraphQL Node is an edge/link and an Edge is a node
	formatSwapped: (data: NetworkDiagramQuery$data): NetworkObject => {
		const nodes: cytoscape.NodeDataDefinition[] = [];
		const edges: cytoscape.EdgeDataDefinition[] = [];

		data?.Node?.edges?.forEach(edge => {
			if (!edge) return;
			processEdgeAsNode({
				id: edge.id,
				source: data.Node?.id as string,
				target: edge.nodes?.[0]?.id as string,
			}, nodes, edges);
		});

		return {
			nodes: uniqBy(nodes, 'id').map(node => ({ data: node })),
			edges: consolidateEdges(edges).map(edge => ({ data: edge }))
		};
	}
};

// Recursive helper functions
function processNode(
	node: cytoscape.NodeDataDefinition,
	nodesArray: cytoscape.NodeDataDefinition[],
	edgesArray: cytoscape.EdgeDataDefinition[]) {
	if (!node?.id || node.edges.length < 2) return;

	nodesArray.push({
		id: node.id,
		label: node.name
	});

	node.edges.forEach((edge: cytoscape.EdgeDataDefinition) => {
		if (!edge) return;
		const edgeId = edge.id;

		if(edge.nodes) {

			edge.nodes.forEach((node: cytoscape.NodeDataDefinition) => {
				if(!node) return;
				if(target && target.id !== node.id) {
					edgesArray.push({
						id: edge.id,
						source: node.id as string,
						target: target.id,
						label: edge.name
					});
				}

				processNode(node, nodesArray, edgesArray);
			});
		}
	});
}

function processEdgeAsNode(edge: cytoscape.EdgeDataDefinition, nodesArray: cytoscape.NodeDataDefinition[], edgesArray: cytoscape.EdgeDataDefinition[]) {
	if(!edge?.id) return;

	// Check if the edge already exists in the nodes array
	if(!nodesArray.some(n => n.id === edge.id)) {
		nodesArray.push(edge);
	}

	// Process each node, but treat it as an edge
	edge.nodes?.forEach((node: cytoscape.NodeDataDefinition) => {
		const targetEdge = node?.edges?.[0];
		if(targetEdge?.id) {
			// If the target edge doesn't exist, add it
			if(!nodesArray.some(n => n.id === targetEdge.id)) {
				nodesArray.push(targetEdge);
			}

			// Add the edge, ensuring no self-loops
			if(edge.id !== targetEdge.id) {
				edgesArray.push({
					id: node.id,
					source: edge.id as string,
					target: targetEdge.id,
					label: node.name
				});
			}

			// Recursively process the target edge to handle nested structures
			processEdgeAsNode(targetEdge, nodesArray, edgesArray);
		}
	});
}

function consolidateEdges(edges: cytoscape.EdgeDataDefinition[]): cytoscape.EdgeDataDefinition[] {
	const initialResult = edges.reduce((acc: cytoscape.EdgeDataDefinition[], edge) => {
		const match = acc.find(
			(e) => (e.source === edge.source && e.target === edge.target)
		);
		const reverseMatch = acc.find(
			(e) => (e.source === edge.target && e.target === edge.source)
		);

		if(match || reverseMatch) {
			if (match) {
				match.label += `,${edge.label.trim()}`;
			}
			if (reverseMatch) {
				reverseMatch.label += `,${edge.label.trim()}`;
			}
		}
		else {
			acc.push(edge);
		}

		return acc;
	}, []);

	return initialResult.map((edge: cytoscape.EdgeDataDefinition) => {
		const labelsArray = edge.label.split(',');
		edge.label = uniq(labelsArray)?.join(',');

		return edge;
	});
}