import { FC, startTransition, Suspense, useCallback, useState } from 'react';
import { ControlBar, PageWrapper, SkeletonTable } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { NumberPicker, MultiSelect, SelectionInputs } from '../components/data-presentation';
import { TvShowRankings } from '../page-content';

export const Rankings: FC = () => {
	const [limit, setLimit] = useState<number>(25);
	const [loadingRows, setLoadingRows] = useState<number>(0);

	const handleLimitChange = useCallback((newLimit: number) => {
		if(newLimit > limit) {
			setLoadingRows(newLimit - limit);
		}
		else {
			setLoadingRows(0);
		}

		startTransition(() => {
			setLimit(newLimit);
			setLoadingRows(0);
		});
	}, [limit]);

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
			<Suspense fallback={<SkeletonTable rows={limit} />}>
				<TvShowRankings limit={limit} loadingRows={loadingRows} />
			</Suspense>
		</PageWrapper>

	);
};
