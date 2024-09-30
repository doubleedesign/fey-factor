import { FC, useMemo } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { BarChart } from '../../components/data-presentation';
import { WatchProviderChartQuery } from '../../__generated__/WatchProviderChartQuery.graphql.ts';
import { Provider } from '../../types';
import { uniq } from 'lodash';

function excludeProvider(provider_name: string): boolean {
	return provider_name.includes('Amazon Channel')
		|| provider_name.includes('Apple TV Channel')
		|| provider_name.includes('Netflix basic with Ads');
}

export const WatchProviderChart: FC = () => {
	const top100 = useLazyLoadQuery<WatchProviderChartQuery>(
		graphql`
            query WatchProviderChartQuery($limit: Int!) {
                TvShows(limit: $limit) {
                    id
                    title
                    providers {
                        provider_id
                        provider_name
                        provider_type
                        logo_path
                    }
                }
            }
		`,
		{ limit: 100 },
		{ fetchPolicy: 'store-or-network' }
	);

	const providerCounts = useMemo(() => {
		const providers: Provider[] = top100?.TvShows?.flatMap(show => show?.providers) as Provider[] ?? [];
		const providerCounts = providers.reduce((acc, provider) => {
			if(!excludeProvider(provider.provider_name)) {
				acc[provider.provider_name] = acc[provider.provider_name] ? acc[provider.provider_name] + 1 : 1;
			}

			return acc;
		}, {} as Record<string, number>);
		
		return Object.entries(providerCounts).map(([provider, count]) => ({ key: provider, data: count })).sort((a, b) => b.data - a.data);
	}, [top100]);

	const providerLists = useMemo(() => {
		const providers: Provider[] = top100?.TvShows?.flatMap(show => show?.providers) as Provider[] ?? [];
		const order = providerCounts.map(provider => provider.key);
		const providerKeys = uniq(providers.map(provider => provider.provider_name))
			.filter(provider_name => !excludeProvider(provider_name))
			.sort((a, b) => order.indexOf(a) - order.indexOf(b));

		const emptyProviderLists = providerKeys.reduce((acc, provider) => {
			acc[provider] = [];

			return acc;
		}, {} as Record<string, string[]>);

		const providerLists = top100?.TvShows?.reduce((acc, show) => {
			show?.providers?.forEach((provider => {
				if(provider && provider.provider_name && !excludeProvider(provider.provider_name)) {
					acc[provider.provider_name].push(show.title as string);
				}
			}));

			return acc;
		}, emptyProviderLists as Record<string, string[]>);

		return providerLists;
	}, [top100, providerCounts]);

	return (
		<BarChart title="Watch providers for top 100 shows"
			data={providerCounts}
			lists={providerLists}
		/>
	);
};
