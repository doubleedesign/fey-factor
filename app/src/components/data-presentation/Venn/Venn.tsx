import { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
// @ts-expect-error TS7016: Could not find a declaration file for module venn.js
import * as venn from 'venn.js';
import { StyledVenn } from './Venn.style';

type VennSet = {
	sets: string[];
	size: number;
};

type VennProps = {
	sets: VennSet[];
};

export const Venn: FC<VennProps> = ({ sets }) => {
	const vennRef = useRef<HTMLElement>(null);

	// Ensure the container is loaded before attempting to populate the diagram
	useEffect(() => {
		if (vennRef.current) {
			const chart = venn.VennDiagram().width(2000).height(1000);
			d3.select(vennRef.current).datum(sets).call(chart);
		}
	}, [sets]);

	return <StyledVenn ref={vennRef} />;
};
