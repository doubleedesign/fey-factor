import { FC, Fragment, startTransition, Suspense,  useState, useCallback, useEffect } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { MultiSelect, NumberPicker, SelectionInputs } from '../components/data-presentation';
import { TvShowRankings } from '../page-content';
import { Filters, MultiSelectOption, Provider } from '../types';
import { MultiValue } from 'react-select';
import { fetchWatchProviders, sortProviders } from '../controllers/watch-providers.ts';
import { useRankingContext } from '../controllers/RankingContext.tsx';
import { TableSkeleton } from '../components/loading';


export const Rankings: FC = () => {
	const [limit, setLimit] = useState<number>(20);
	const [loadingRows, setLoadingRows] = useState<number>(0);
	const [providers, setProviders] = useState<MultiSelectOption[]>([]);
	const [selectedProviders, setSelectedProviders] = useState<MultiSelectOption[]>([]);
	const { filter, columns, visibleColumns, setVisibleColumns, alwaysVisibleColumns } = useRankingContext();

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
		});
	}, [limit]);

	const handleColumnVisibilityChange = useCallback((selected: MultiValue<MultiSelectOption>) => {
		// @ts-expect-error TS2345: Argument of type MultiSelectOption[] is not assignable to parameter of type Pick<Column, 'value' | 'label'>[].
		// Type string is not assignable to type Column['value']
		setVisibleColumns(selected as MultiSelectOption[]);
	}, [setVisibleColumns]);

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
					<NumberPicker label="Show top:" defaultValue={20} onChange={handleLimitChange} />
					<MultiSelect
						label="Show columns"
						options={columns.filter(col => !alwaysVisibleColumns.includes(col.value))} // these should always be visible
						selectedOptions={visibleColumns}
						onChange={handleColumnVisibilityChange}
						showAs="checkboxes"
					/>
					{/* TODO: Put an error boundary around this so if providers don't load it doesn't kill the whole thing */}
					<MultiSelect
						label={`Filter top ${limit} by streaming availability:`}
						options={providers}
						selectedOptions={providers.filter(provider => selectedProviders.includes(provider))}
						onChange={handleProviderFilterChange}
					/>
				</SelectionInputs>
			</ControlBar>
			<Suspense fallback={<TableSkeleton rows={limit} />}>
				<TvShowRankings limit={limit} loadingRows={loadingRows} />
			</Suspense>
		</PageWrapper>
	);
};
