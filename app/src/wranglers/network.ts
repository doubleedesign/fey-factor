import { NetworkDiagramQuery$data } from '../__generated__/NetworkDiagramQuery.graphql.ts';
import cytoscape from 'cytoscape';
import { NetworkObject } from '../types.ts';
import { groupBy, uniqBy, uniqueId } from 'lodash';

export class NetworkWrangler {
	rawData: NetworkDiagramQuery$data;
	nodes: cytoscape.NodeDataDefinition[];
	edges: cytoscape.EdgeDataDefinition[];

	constructor(rawData: NetworkDiagramQuery$data) {
		this.rawData = rawData;
		this.nodes = [];
		this.edges = [];
	}

	clearData(): void {
		this.nodes = [];
		this.edges = [];
	}

	/**
	 * Format the data in the "standard" way, i.e., corresponding to the GraphQL objects of Node and Edge
	 * (Nodes correspond to people, and Edges correspond to shows)
	 */
	formatStandard(): void {
		this.clearData(); // Clear the data so that swapping between people and shows as nodes works as expected

		const { Node } = this.rawData;

		this.nodes.push({
			id: Node?.id,
			label: Node?.name
		});

		this.processFromNode(Node, 0);
		this.consolidateNodes();
		this.limitToTopXNodes(30);
		this.consolidateEdges();
		this.limitToEdgeWeight(2);
	}

	/**
	 * Format the data in the "swapped" way, i.e., Nodes returned from the GraphQL query are treated as Edges and vice versa
	 * (Shows treated as Nodes and people treated as Edges)
	 */
	formatSwapped(): void {
		this.clearData(); // Clear the data so that swapping between people and shows as nodes works as expected

		const pseudoNodes = this.rawData?.Node?.edges;

		pseudoNodes?.forEach(edgeAsNode => {
			this.nodes.push({
				id: edgeAsNode?.id,
				label: edgeAsNode?.name
			});

			this.processFromEdgeAsNode(edgeAsNode, 0);
		});

		this.consolidateNodes();
		this.limitToTopXNodes(30);
		this.consolidateEdges();
		this.limitToEdgeWeight(2);
	}

	/**
	 * Recursively process nodes and edges starting from a given node
	 * @param node
	 * @param level
	 */
	processFromNode(node: NetworkDiagramQuery$data['Node'], level: number) : void {
		node?.edges?.forEach(edge => {
			if(!edge?.nodes || edge.id === '1667_T') return; // 1667 = SNL

			const nodesToUse = edge.nodes.filter(subNode => subNode?.edges && subNode?.edges?.length > 2);

			nodesToUse.forEach(target => {
				const nodeExists = this.nodes.find(n => n.id === target?.id);

				if(!nodeExists) {
					this.nodes.push({
						id: target?.id,
						label: target?.name
					});
				}

				const edgeExists = this.edges.find(e => {
					return (
						(e.source === node?.id && e.target === target?.id || e.source === target?.id && e.target === node?.id)
						&& e.label === edge.name
					);
				});
				if(!edgeExists) {
					this.edges.push({
						id: uniqueId(),
						source: node?.id as string,
						target: target?.id as string,
						label: edge.name
					});
				}

				// Recursively process the target node
				this.processFromNode(target, level + 1);
			});
		});
	}

	/**
	 * Recursively process nodes and edges starting from a given edge,
	 * where what is usually an edge is treated as a node and vice versa
	 * @param edgeAsNode
	 * @param level
	 */
	processFromEdgeAsNode(edgeAsNode, level: number) : void {
		const nodesAsEdges = edgeAsNode?.nodes;

		nodesAsEdges?.forEach(pseudoNode => {
			if(!pseudoNode?.edges) return;

			const nodesToUse = pseudoNode.edges.filter(subNode => subNode?.edges && subNode?.edges?.length > 2);

			nodesToUse.forEach(target => {
				const nodeExists = this.nodes.find(n => n.id === target?.id);

				if(!nodeExists) {
					this.nodes.push({
						id: target?.id,
						label: target?.name
					});
				}

				const edgeExists = this.edges.find(e => {
					return (
						(e.source === pseudoNode?.id && e.target === target?.id || e.source === target?.id && e.target === pseudoNode?.id)
						&& e.label === edgeAsNode.name
					);
				});
				if(!edgeExists) {
					this.edges.push({
						id: uniqueId(),
						source: pseudoNode?.id as string,
						target: target?.id as string,
						label: edgeAsNode.name
					});
				}

				// Recursively process the target node
				this.processFromEdgeAsNode(target, level + 1);
			});
		});
	}

	/**
	 * Remove duplicate nodes
	 */
	consolidateNodes(): void {
		this.nodes = uniqBy(this.nodes, 'id');
	}

	/**
	 * Sort the nodes by degree (graph theory degree i.e., number of edges, not degree of separation from Tina Fey)
	 * and then limit the visualisation to the top X nodes
	 * @param X
	 */
	limitToTopXNodes(X: number) {
		// Create an object of nodeId -> edgeCount mappings
		const edgeCounts = this.edges.reduce((acc: { [key: string]: number }, edge: cytoscape.EdgeDataDefinition) => {
			acc[edge.source] = (acc[edge.source] || 0) + 1;
			acc[edge.target] = (acc[edge.target] || 0) + 1;

			return acc;
		}, {});

		// Use the edge counts to sort the nodes
		const sortedNodes = [...this.nodes].sort((a: cytoscape.NodeDataDefinition, b: cytoscape.NodeDataDefinition) => {
			const countA = edgeCounts[a.id as string] || 0;
			const countB = edgeCounts[b.id as string] || 0;

			return countB - countA;
		});

		// Select the top X nodes
		const topNodes: cytoscape.NodeDataDefinition[] = sortedNodes.slice(0, X);

		// Create a set of node IDs for quick lookup
		const topNodeIds = new Set(topNodes.map(node => node.id));

		//  Filter edges to keep only those connected to the top N nodes
		const filteredEdges = this.edges.filter((edge: cytoscape.EdgeDataDefinition) =>
			topNodeIds.has(edge.source) && topNodeIds.has(edge.target)
		);

		// Step 5: Save the new filtered data with top nodes and valid edges
		this.nodes = topNodes;
		this.edges = filteredEdges;
	}

	/**
	 * Combine edges with the same source and target into a single edge
	 * with a combined label and a weight property representing the number of edges that just got combined
	 */
	consolidateEdges(): void {
		// Group edges by the sorted source and target
		const grouped = groupBy(this.edges, edge => [edge.source, edge.target].sort().join('-'));

		// Sort the groups by the number of edges in each group
		const sortedGroups = Object.values(grouped).sort((a, b) => b.length - a.length);

		// Combine labels for each group and then filter out self-referencing edges
		this.edges = Object.values(sortedGroups).map(group => {
			// If there's more than one edge in the group, combine their labels
			if (group.length > 1) {
				return {
					source: group[0].source,
					target: group[0].target,
					label: group.map(edge => edge.label).join(', '),
					weight: group.length
				};
			}

			// If there's only one edge, return it as is
			return {
				...group[0],
				weight: 1
			};
		}).filter(edge => edge.source !== edge.target);
	}

	/**
	 * Limit the visualisation to edges with a given weight or higher
	 * @param X
	 */
	limitToEdgeWeight(X: number) {
		this.edges = this.edges.filter(edge => edge.weight >= X);
	}

	/**
	 * Format the data in a way that can be consumed by Cytoscape
	 */
	getFormattedData(): NetworkObject {
		return {
			nodes: Array.from(this.nodes).map(node => ({ data: node })),
			edges: Array.from(this.edges).map(edge => ({ data: edge }))
		};
	}
}
