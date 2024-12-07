import { FC, useState, useEffect, useCallback } from 'react';
import { createVennJSAdapter, ISetLike, VennDiagram, VennDiagramProps } from '@upsetjs/react';
import { layout } from '@upsetjs/venn.js';
import { VennSet } from './Venn.tsx';
import theme from '../../../theme.ts';
import { StyledEulerVennWrapper } from './Venn.style.ts';

type EulerProps = VennDiagramProps;

export const Euler: FC<EulerProps> = ({ sets, combinations }) => {
	const [selected, setSelected] = useState(null);
	const [hovered, setHovered] = useState<ISetLike<VennSet> | null>(null);

	const handleClick = useCallback((selection: any) => {
		// TODO: Show the details in a panel next to the diagram
		console.log(selection);
		setSelected(selection);
	}, []);

	return (
		<StyledEulerVennWrapper data-test-id="EulerVennWrapper">
			{/** @ts-expect-error TS2786: VennDiagram cannot be used as a JSX component */}
			<VennDiagram
				layout={createVennJSAdapter(layout)}
				sets={sets}
				combinations={combinations}
				width={900}
				height={600}
				onClick={handleClick}
				onHover={setHovered}
				selection={hovered || selected}
				exportButtons={false}
				tooltips={true}
				selectionColor={theme.colors.accent}
				fontFamily={theme.fontFamily.body}
			/>
			<small>Warning: Euler layout may not show all intersections, especially for large datasets.</small>
		</StyledEulerVennWrapper>
	);
};

export default Euler;