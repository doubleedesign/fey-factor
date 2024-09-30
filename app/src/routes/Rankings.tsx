import { FC, Fragment, startTransition, Suspense,  useState, useCallback, useEffect } from 'react';
import { ControlBar, PageWrapper, SkeletonTable } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { MultiSelect, NumberPicker, SelectionInputs } from '../components/data-presentation';
import { TvShowRankings } from '../page-content';
import { Filters, MultiSelectOption, Provider } from '../types';
import { MultiValue } from 'react-select';
import { fetchWatchProviders, sortProviders } from '../controllers';
import { useRankingContext } from '../controllers/context/RankingContext.tsx';


export const Rankings: FC = () => {
	const [limit, setLimit] = useState<number>(25);
	const [loadingRows, setLoadingRows] = useState<number>(0);
	const [providers, setProviders] = useState<MultiSelectOption[]>([]);
	const [selectedProviders, setSelectedProviders] = useState<MultiSelectOption[]>([]);
	const { filter } = useRankingContext();

	// Load watch providers on initial render
	useEffect(() => {
		fetchWatchProviders().then(data => {
			if(data.results) {
				setProviders(
					sortProviders(data.results.filter((provider: Provider) => {
						return !provider.provider_name.includes('Amazon Channel')
							&& !provider.provider_name.includes('Apple TV Channel')
							&& !provider.provider_name.includes('Netflix basic with Ads');
					}))
						.slice(0, 14)
						.map((provider: Provider) => {
							return {
								value: provider.provider_id.toString(),
								label: (
									<Fragment key={provider.provider_id}>
										<img src={`https://media.themoviedb.org/t/p/original/${provider.logo_path}`} alt={provider.provider_name} />
										<span>{provider.provider_name}</span>
									</Fragment>
								)
							} as MultiSelectOption;
						})
				);
			}
		});
	}, []);

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

	const handleProviderFilterChange = useCallback((selected: MultiValue<MultiSelectOption>) => {
		setSelectedProviders(selected as MultiSelectOption[]);
		filter({ available_on: selected.map(option => option.value) } as Filters);
	}, [filter]);

	return (
		<PageWrapper>
			<ControlBar>
				<div>
					<Heading level="h1">TV Show Rankings</Heading>
					<LeadParagraph>Raw and (experimentally) aggregated scores</LeadParagraph>
				</div>
				<SelectionInputs>
					<NumberPicker label="Show top:" defaultValue={25} onChange={handleLimitChange} />
					<MultiSelect
						label={`Filter top ${limit} by availability:`}
						options={providers}
						selectedOptions={providers.filter(provider => selectedProviders.includes(provider))}
						onChange={handleProviderFilterChange}
					/>
				</SelectionInputs>
			</ControlBar>
			<Suspense fallback={<SkeletonTable rows={limit} />}>
				<TvShowRankings limit={limit} loadingRows={loadingRows} />
			</Suspense>
		</PageWrapper>

	);
};
