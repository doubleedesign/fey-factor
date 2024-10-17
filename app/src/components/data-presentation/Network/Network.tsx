import { FC, useRef, useEffect, useMemo, useCallback } from 'react';
import { StyledNetwork } from './Network.style';
import CytoscapeComponent from 'react-cytoscapejs';
import { NetworkObject } from '../../../types.ts';
import cytoscape, { Core } from 'cytoscape';

type NetworkProps = {
	formattedData: NetworkObject;
	dimensions: { width: number; height: number };
};

export const Network: FC<NetworkProps> = ({ formattedData, dimensions }) => {
	const cyRef = useRef<Core | null>(null);

	const normalisedData = useMemo(() => {
		return CytoscapeComponent.normalizeElements(formattedData);
	}, [formattedData]);

	const handleNodeTap = useCallback((event: cytoscape.EventObject) => {
		const cy = cyRef.current;

		console.log('tapped node:', event.target.data());

		const node = event.target; // The clicked node

		// Define the highlighting styles
		cy?.style()
			.selector('.highlighted')
			.style({
				'background-color': 'yellow', // Highlight the node with a specific color
				'line-color': 'yellow',       // Highlight the edges connected to the node
				'target-arrow-color': 'yellow',
				'source-arrow-color': 'yellow',
				'width': 4,                   // Optional: Increase the thickness of the edges
			})
			.update();

		// Remove the 'highlighted' class from all nodes and edges
		cy?.elements().removeClass('highlighted');

		// Add the 'highlighted' class to the clicked node
		node.addClass('highlighted');

		// Add the 'highlighted' class to the connected edges and their target nodes
		node.connectedEdges().addClass('highlighted'); // Highlight edges
		node.connectedEdges().targets().addClass('highlighted'); // Highlight target nodes
		node.connectedEdges().sources().addClass('highlighted'); // Highlight source nodes if needed
	}, []);

	const handleEdgeTap = useCallback((event: cytoscape.EventObject) => {
		console.log('tapped edge:', event.target.data());
	}, []);

	// Add the event listeners here so memoised callback functions can be used
	useEffect(() => {
		const cy = cyRef.current;
		cy?.on('tap', 'node', handleNodeTap);
		cy?.on('tap', 'edge', handleEdgeTap);

		// Clean up event listeners when component unmounts
		return () => {
			cy?.off('tap', 'node', handleNodeTap);
			cy?.off('tap', 'edge', handleEdgeTap);
		};
	}, [handleNodeTap, handleEdgeTap]);

	// Centre the graph when container dimensions change
	useEffect(() => {
		if (dimensions.width > 0 && cyRef.current) {
			const cy = cyRef.current;

			const handleLayoutStop = () => {
				cy.fit();
				cy.center();
			};

			cy.on('layoutstop', handleLayoutStop);

			// Clean up the event listener on component unmount or when dimensions change
			return () => {
				cy.off('layoutstop', handleLayoutStop);
			};
		}
	}, [dimensions]);

	const layout = {
		name: 'concentric',
		fit: true,
		animate: true,
		spacingFactor: 1,
	};

	const stylesheet = [
		{
			selector: 'node',
			style: {
				'label': 'data(label)',
				'width': 20,
				'height': 20,
				'background-color': '#0074D9',
				'font-size': '12px',
			}
		},
		{
			selector: 'edge',
			style: {
				'label': 'data(label)',
				'width': 2,
				'line-color': '#aaa',
				'font-size': '12px'
			}
		}
	];

	return (
		<StyledNetwork data-testid="Network">
			<CytoscapeComponent
				cy={(cy) => (cyRef.current = cy)} // Capture the cy instance for use in other functions
				layout={layout}
				style={dimensions}
				stylesheet={stylesheet}
				elements={normalisedData}
				zoom={1}
				zoomingEnabled={true}
				minZoom={0.5}
				maxZoom={1.5}
				wheelSensitivity={0.1}
				panningEnabled={true}
			/>
		</StyledNetwork>
	);
};
