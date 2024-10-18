import { FC, Suspense, useCallback, useState } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { NetworkDiagram } from '../page-content/NetworkDiagram/NetworkDiagram.tsx';
import { SingleValueSelect } from '../components/data-presentation/SingleValueSelect/SingleValueSelect.tsx';
import { SelectionInputs } from '../components/data-presentation';
import { SingleSelectOption } from '../types.ts';


export const Network: FC = () => {
	const [selectedOption, setSelectedOption] = useState('people');
	const options: SingleSelectOption[] = [
		{ label: 'shows', value: 'shows' },
		{ label: 'people', value: 'people' },
	];

	const handleNodeTypeChange = useCallback((value: string) => {
		setSelectedOption(value);
	}, []);

	return (
		<PageWrapper>
			<ControlBar>
				<div>
					<Heading level="h1">Network Diagram</Heading>
					<LeadParagraph>Follow the connection paths visually</LeadParagraph>
				</div>
				<SelectionInputs>
					<SingleValueSelect
						label="Nodes are: " 
						options={options}
						defaultSelected={options.find(option => option.value === selectedOption) as SingleSelectOption}
						onChange={handleNodeTypeChange}
					/>
				</SelectionInputs>
			</ControlBar>
			<Suspense fallback={<div>Loading...</div>}>
				<NetworkDiagram nodesAre={selectedOption} />
			</Suspense>
		</PageWrapper>
	);
};
