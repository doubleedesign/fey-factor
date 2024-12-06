import { FC, useState, useMemo, useCallback } from 'react';
import { extractSets, generateCombinations, VennDiagram, ISetLike } from '@upsetjs/react';
import { StyledVenn } from './Venn.style';

type VennSet = {
	name: string;
	sets: string[];
};

type VennProps = {
	data: VennSet[];
};

export const Venn: FC<VennProps> = ({ data }) => {
	const [selected, setSelected] = useState(null);
	const [hovered, setHovered] = useState<ISetLike<VennSet> | null>(null);
	const sets= useMemo(() => extractSets(data), [data]);
	const combinations = useMemo(() => generateCombinations(sets), [sets]);

	const handleClick = useCallback((selection) => {
		// TODO: Show the details in a panel next to the diagram
		console.log(selection);
	}, []);

	return (
		<StyledVenn>
			{/** @ts-expect-error TS2786: VennDiagram cannot be used as a JSX component. */}
			<VennDiagram
				sets={sets}
				combinations={combinations}
				width={900}
				height={600}
				onClick={handleClick}
				onHover={setHovered}
				selection={hovered}
				exportButtons={false}
			/>
		</StyledVenn>
	);
};
