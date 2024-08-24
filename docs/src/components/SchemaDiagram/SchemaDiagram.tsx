import { ReactFlow, type Node, type Edge, useReactFlow, InternalNode, Rect } from '@xyflow/react';
import { useEffect, useState, useCallback } from 'react';

type SchemaDiagramProps = {
	nodes: Node[];
	edges: Edge[];
};

const useBounds = (nodes: Node[], deps: any[]) => {
	const { getInternalNode } = useReactFlow();
	const [bounds, setBounds] = useState<Rect | null>(null);

	useEffect(() => {
		if(nodes.length > 0) {
			const leftmostNodeEdge = nodes.reduce((acc, node) => {
				const { position } = getInternalNode(node.id) as InternalNode;
				return Math.min(acc, position.x || 0);
			}, Infinity);

			const rightmostNodeEdge = nodes.reduce((acc, node) => {
				const { position, measured } = getInternalNode(node.id) as InternalNode;
				return Math.max(acc, position.x + (measured?.width || 0));
			}, -Infinity);

			const topmostNodeEdge = nodes.reduce((acc, node) => {
				const { position } = getInternalNode(node.id) as InternalNode;
				return Math.min(acc, position.y || 0);
			}, Infinity);

			const bottommostNodeEdge = nodes.reduce((acc, node) => {
				const { position, measured } = getInternalNode(node.id) as InternalNode;
				return Math.max(acc, position.y + (measured?.height || 0));
			}, -Infinity);

			const newBounds = {
				x: leftmostNodeEdge,
				y: topmostNodeEdge,
				width: rightmostNodeEdge - leftmostNodeEdge,
				height: bottommostNodeEdge - topmostNodeEdge,
			};

			if (!bounds || bounds?.width === 0) {
				setBounds(newBounds);
			}
		}
	}, [nodes, ...deps]);

	return { bounds };
};

const useMeasurements = (nodes: Node[], deps: any[]) => {
	const { getInternalNode } = useReactFlow();
	const [measurements, setMeasurements] = useState<{ [key: string]: { width: number, height: number } }>({});

	useEffect(() => {
		if(nodes.length > 0) {
			const newMeasurements = nodes.reduce((acc, node) => {
				const { position, measured } = getInternalNode(node.id) as InternalNode;
				return {
					...acc,
					[node.id]: {
						width: measured?.width || 0,
						height: measured?.height || 0,
					},
				};
			}, {} as { [key: string]: { width: number, height: number } });

			setMeasurements(newMeasurements);
		}
	}, [nodes, ...deps]);

	return { measurements };
};

export function SchemaDiagram({ nodes, edges }: SchemaDiagramProps) {
	const { measurements } = useMeasurements(nodes, []);
	const { bounds } = useBounds(nodes, [measurements]);

	// TODO: Run fitview initially, not every re-render because nodes changed,
	// and then fitBounds only when the diagram gets narrower
	// Maybe needs some kind of context or something to keep track of the initial render vs re-renders?

	const onChange = useCallback((reactFlowInstance) => {
		console.log('change');
		reactFlowInstance.fitBounds(bounds);
	}, [bounds, measurements]);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={{
				entity: ({ data }) => data.component,
			}}
			onNodesChange={onChange}
		/>
	);
}
