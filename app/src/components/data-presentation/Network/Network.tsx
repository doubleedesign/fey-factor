import { FC, useMemo } from 'react';
import { StyledNetwork } from './Network.style';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';

type NetworkProps = {
	formattedData: cytoscape.ElementDefinition[];
	dimensions: { width: number; height: number };
};

export const Network: FC<NetworkProps> = ({ formattedData, dimensions }) => {
	const layout = { name: 'grid' };
	const style = [
		{
			selector: 'node',
			style: {
				'background-color': '#0074D9',
				'label': 'data(label)',
				'color': '#fff',
				'font-size': '12px',
				'text-halign': 'center',
				'text-valign': 'center'
			}
		},
		{
			selector: 'edge',
			style: {
				'width': 2,
				'line-color': '#aaa',
				'target-arrow-color': '#aaa',
				'target-arrow-shape': 'triangle',
				'label': 'data(label)'
			}
		}
	];


	const handleNodeClick = (id: string) => {
		console.log(`Clicked node ${id}`);
	};

	const handleEdgeClick = (source: string, target: string) => {
		console.log(`Clicked edge from ${source} to ${target}`);
	};

	return (
		<StyledNetwork data-testid="Network">
			<CytoscapeComponent
				elements={formattedData}
				minZoom={0.1}
				maxZoom={1}
				zoomingEnabled={true}
				userZoomingEnabled={true}
				panningEnabled={true}
			/>
		</StyledNetwork>
	);
};
