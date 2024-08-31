import { FC, startTransition, Suspense, useCallback, useState } from 'react';
import { ControlBar } from '../components/ControlBar/ControlBar.tsx';
import { NumberPicker } from '../components/NumberPicker/NumberPicker.tsx';
import { TvShowRankings } from '../components/TvShowRankings/TvShowRankings.tsx';
import { Heading } from '../components/Heading/Heading.tsx';
import { PageWrapper } from '../components/PageWrapper/PageWrapper.tsx';

export const Rankings: FC = () => {
	const [limit, setLimit] = useState<number>(20);

	const handleLimitChange = useCallback((newLimit: number) => {
		startTransition(() => {
			setLimit(newLimit);
		});
	}, []);

	return (
		<Suspense>
			<PageWrapper>
				<ControlBar>
					<Heading level="h1">TV Show Rankings</Heading>
					<NumberPicker defaultValue={20} onChange={handleLimitChange} />
				</ControlBar>
				<TvShowRankings limit={limit} />
			</PageWrapper>
		</Suspense>
	);
};
