import { FC, PropsWithChildren, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import { StyledLinkToNode } from './LinkToNode.style';
import { useReactFlow } from '@xyflow/react';
import { typeFormatToDbTableNameFormat } from '../../controllers/utils.ts';

type LinkToNodeProps = {
	id: string;
}

export const LinkToNode: FC<PropsWithChildren<LinkToNodeProps>> = ({ id, children }) => {
	const { getNodes, fitView } = useReactFlow();
	const nodes = document.querySelectorAll('[data-entity-group-id]');

	const highlightNode = (id: string) => {
		nodes.forEach((node) => node.classList.add('dimmed'));
		const element = document.querySelector(`[data-entity-group-id="${id}"]`);
		element && element.classList.add('highlighted');
	};

	const unhighlightNode = (id: string) => {
		setTimeout(() => {
			nodes.forEach((node) => node.classList.remove('dimmed'));
			const element = document.querySelector(`[data-entity-group-id="${id}"]`);
			element && element.classList.remove('highlighted');
		}, 2000);
	};

	const moveToNode = useCallback((event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
		event.preventDefault();
		event.stopPropagation();
		const node = getNodes().find((n) => n.id === typeFormatToDbTableNameFormat(id));
		if (node) {
			highlightNode(typeFormatToDbTableNameFormat(id));
			fitView({ nodes: [node], duration: 300, minZoom: 0.5, maxZoom: 1.25 }).then(
				() => unhighlightNode(typeFormatToDbTableNameFormat(id))
			);
		}
		else {
			console.log(`TODO: Open a popup for type ${id}`);
		}
	}, [id, getNodes]);

	return (
		<StyledLinkToNode data-testid="LinkToNode" onClick={moveToNode}>
			{children}
			<i className="fa-light fa-arrow-up-left-from-circle"></i>
		</StyledLinkToNode>
	);
};
