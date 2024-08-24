import { ReactFlow, type Node, type Edge, useReactFlow, InternalNode, Rect } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { useDiagramContext } from '../../context/DiagramContext.tsx';

type SchemaDiagramProps = {
	nodes: Node[];
	edges: Edge[];
};

const useBounds = (nodes: Node[], deps: any[]) => {
	const { getInternalNode } = useReactFlow();
	const [bounds, setBounds] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });

	useEffect(() => {
		if(nodes?.length > 0) {
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

	return { newBounds: bounds };
};

export function SchemaDiagram({ nodes, edges }: SchemaDiagramProps) {
	const { bounds, setBounds, onInit } = useDiagramContext();
	const { newBounds } = useBounds(nodes, []);

	useEffect(() => {
		if (
			// Set bounds if they are not already set
			!bounds && newBounds.width > 0
			// Update bounds if new bounds are narrower than current bounds
			|| bounds && (newBounds.width < bounds.width) && (newBounds.width > 0)
		) {
			setBounds(newBounds);
		}
	}, [newBounds, bounds, setBounds]);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={{
				entity: ({ data }) => data.component,
			}}
			onInit={onInit}
		/>
	);
}
