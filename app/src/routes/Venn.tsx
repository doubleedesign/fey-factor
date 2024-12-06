import { FC, useState, useCallback, Suspense } from 'react';
import { VennDiagram } from '../page-content';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { SelectionInputs, NumberPicker } from '../components/data-presentation';

export const Venn: FC = () => {
	const [maxAverageDegree, setMaxAverageDegree] = useState<number>(1.5);
	const [minConnections, setMinConnections] = useState<number>(5);

	const handleDegreeChange = useCallback((newDegree: number) => {
		setMaxAverageDegree(newDegree);
	}, []);

	const handleConnectionCountChange = useCallback((newConnectionCount: number) => {
		setMinConnections(newConnectionCount);
	}, []);

	return (
		<PageWrapper>
			<ControlBar>
				<div>
					<Heading level="h1">Venn Diagram</Heading>
					<LeadParagraph>The crossovers</LeadParagraph>
				</div>
				<SelectionInputs>
					<span>Limit by show data: </span>
					<NumberPicker label="Max. average degree:" defaultValue={1.5} options={[1, 1.25, 1.5, 1.75]} onChange={handleDegreeChange} />
					<NumberPicker label="Min. total connections:" defaultValue={10} options={[10, 20, 30, 40, 50]} onChange={handleConnectionCountChange} />
				</SelectionInputs>
			</ControlBar>
			<Suspense>
				<VennDiagram maxAverageDegree={maxAverageDegree} minConnections={minConnections} />
			</Suspense>
		</PageWrapper>
	);
};
