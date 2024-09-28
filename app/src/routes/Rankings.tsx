import { FC, startTransition, Suspense, useCallback, useState } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { NumberPicker, MultiSelect, SelectionInputs } from '../components/data-presentation';
import { TvShowRankings } from '../page-content';

export const Rankings: FC = () => {
	const [limit, setLimit] = useState<number>(25);

	const handleLimitChange = useCallback((newLimit: number) => {
		startTransition(() => {
			setLimit(newLimit);
		});
	}, []);

	const options = [
		{ value: 'option1', label: 'Option 1' },
		{ value: 'option2', label: 'Option 2' },
		{ value: 'option3', label: 'Option 3' },
	];

	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleChange = (selected) => {
		setSelectedOptions(selected);
	};

	return (
		<Suspense>
			<PageWrapper>
				<ControlBar>
					<div>
						<Heading level="h1">TV Show Rankings</Heading>
						<LeadParagraph>Raw and (experimentally) aggregated scores</LeadParagraph>
					</div>
					<SelectionInputs>
						<NumberPicker label="Show top:" defaultValue={25} onChange={handleLimitChange} />
						<MultiSelect label={`Filter top ${limit} by availability:`} options={options} selectedOptions={selectedOptions} onChange={handleChange} />
					</SelectionInputs>
				</ControlBar>
				<TvShowRankings limit={limit} />
			</PageWrapper>
		</Suspense>
	);
};
