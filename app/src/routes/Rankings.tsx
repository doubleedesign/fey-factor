import { FC, startTransition, Suspense, useCallback, useState } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { NumberPicker } from '../components/data-presentation';
import { TvShowRankings } from '../page-content';

export const Rankings: FC = () => {
	const [limit, setLimit] = useState<number>(25);

	const handleLimitChange = useCallback((newLimit: number) => {
		startTransition(() => {
			setLimit(newLimit);
		});
	}, []);

	return (
		<Suspense>
			<PageWrapper>
				<ControlBar>
					<div>
						<Heading level="h1">TV Show Rankings</Heading>
						<LeadParagraph>Raw and (experimentally) aggregated scores</LeadParagraph>
					</div>
					<NumberPicker defaultValue={25} onChange={handleLimitChange} />
				</ControlBar>
				<TvShowRankings limit={limit} />
			</PageWrapper>
		</Suspense>
	);
};
