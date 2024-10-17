import { FC, useMemo } from 'react';
import { StyledNetwork } from './Network.style';
import { Graph, GraphLink, GraphNode, GraphProps, NodeLabelProperty } from 'react-d3-graph';

type NetworkProps = {
	formattedData: GraphProps<GraphNode, GraphLink>['data'];
	dimensions: { width: number; height: number };
};

export const Network: FC<NetworkProps> = ({ formattedData, dimensions }) => {

	const config = useMemo(() => {
		if(!formattedData?.nodes || !formattedData?.links) return ({});

		return ({
			nodeHighlightBehavior: true,
			linkHighlightBehavior: true,
			width: dimensions.width || 800,
			height: dimensions.height || 600,
			panAndZoom: true,
			animationDuration: 100,
			staticGraph: false,
			node: {
				color: 'lightgreen',
				size: 140,
				renderLabel: true,
				labelProperty: ('name' as NodeLabelProperty<GraphNode>),
				fontSize: 16,
				draggable: true
			},
			link: {
				highlightColor: 'blue',
				renderLabel: true,
				fontSize: 16
			},
			d3: {
				zoom: 1,
				minZoom: 0.5,
				maxZoom: 2,
				alphaTarget: 0.1,
				gravity: -200,
				onEnd: () => {
					// Constrain nodes to stay within the container after simulation
					formattedData.nodes.forEach((node: GraphNode & { x?: number, y?: number }) => {
						if (node.x && node.x < 0) node.x = 0;
						if (node.y && node.y < 0) node.y = 0;
						if (node.x && node.x > dimensions.width) node.x = dimensions.width;
						if (node.y && node.y > dimensions.height) node.y = dimensions.height;
					});
				},
			}
		});
	}, [dimensions, formattedData]);

	const handleNodeClick = (id: string) => {
		console.log(`Clicked node ${id}`);
	};

	const handleEdgeClick = (source: string, target: string) => {
		console.log(`Clicked edge from ${source} to ${target}`);
	};

	return (
		<StyledNetwork data-testid="Network">
			<Graph id="network" data={formattedData} config={config} onClickNode={handleNodeClick} onClickLink={handleEdgeClick} />
		</StyledNetwork>
	);
};
