import { FC, startTransition, Suspense, useCallback, useEffect, useState } from 'react';
import { ControlBar, PageWrapper, SkeletonTable } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { NumberPicker, MultiSelect, SelectionInputs } from '../components/data-presentation';
import { TvShowRankings } from '../page-content';
import { Provider } from '../types';
import { sortProviders } from '../controllers';

export const Rankings: FC = () => {
	const apiKey = import.meta.env.VITE_TMDB_API_KEY;
	const [limit, setLimit] = useState<number>(25);
	const [loadingRows, setLoadingRows] = useState<number>(0);
	const [providers, setProviders] = useState<Provider[]>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`https://api.themoviedb.org/3/watch/providers/tv?watch_region=AU&api_key=${apiKey}`);
				const data = await response.json();
				setProviders(sortProviders(data.results.filter((provider: Provider) => {
					return !provider.provider_name.includes('Amazon Channel')
						&& !provider.provider_name.includes('Apple TV Channel')
						&& !provider.provider_name.includes('Netflix basic with Ads');
				})).slice(0, 12));
			}
			catch (error) {
				console.error('Error fetching providers: ', error);
			}
		};

		fetchData();
	}, [apiKey]);

	useEffect(() => {
		console.log('Providers: ', providers);
	}, [providers]);

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

	const handleChange = (selected: Provider[]) => {
		setProviders(selected);
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
					<MultiSelect label={`Filter top ${limit} by availability:`} options={providers} selectedOptions={[]} onChange={handleChange} />
				</SelectionInputs>
			</ControlBar>
			<Suspense fallback={<SkeletonTable rows={limit} />}>
				<TvShowRankings limit={limit} loadingRows={loadingRows} />
			</Suspense>
		</PageWrapper>

	);
};
