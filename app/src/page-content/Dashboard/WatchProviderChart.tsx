import { FC, ReactNode, Suspense, useMemo } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { WatchProviderChartQuery } from '../../__generated__/WatchProviderChartQuery.graphql.ts';
import { Provider } from '../../types';
import { uniq } from 'lodash';
import { BarChart, ShowCard } from '../../components/data-presentation';

function excludeProvider(provider_name: string): boolean {
	return provider_name.includes('Amazon Channel')
		|| provider_name.includes('Apple TV Channel')
		|| provider_name.includes('Netflix basic with Ads');
}

export const WatchProviderChart: FC = () => {
	const max = 10;

	const top100 = useLazyLoadQuery<WatchProviderChartQuery>(
		graphql`
            query WatchProviderChartQuery($limit: Int!) {
                TvShows(limit: $limit) {
                    id
                    title
                    providers(filter: { provider_type: ["flatrate", "free"] }) {
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
		
		return Object.entries(providerCounts).map(([provider, count]) => {
			return ({ key: provider, data: count });
		}).sort((a, b) => {
			return b.data - a.data;
		}).slice(0, max);
	}, [top100]);

	const providerDataLists = useMemo(() => {
		const providers: Provider[] = top100?.TvShows?.flatMap(show => show?.providers) as Provider[] ?? [];
		const order = providerCounts.map(provider => provider.key);
		const providerKeys = uniq(providers.map(provider => provider.provider_name))
			.filter(provider_name => !excludeProvider(provider_name))
			.sort((a, b) => order.indexOf(a) - order.indexOf(b));

		const emptyProviderDataLists = providerKeys.reduce((acc, provider) => {
			acc[provider] = [];

			return acc;
		}, {} as Record<string, ReactNode[]>);

		return top100?.TvShows?.reduce((acc, show) => {
			show?.providers?.forEach((provider => {
				if(provider && provider.provider_name && acc[provider.provider_name] && !excludeProvider(provider.provider_name) && show.id) {
					acc[provider.provider_name].push(
						<Suspense>
							<ShowCard key={show.id} id={parseInt(show.id)} />
						</Suspense>
					);
				}
			}));

			return acc;
		}, emptyProviderDataLists as Record<string, ReactNode[]>);

	}, [top100, providerCounts]);

	return (
		<BarChart
			title="Top 10 streaming providers for top 100 shows"
			description="Provider data is limited to Australia and excludes purchase/rent availability and sub-channels (e.g. Paramount+ via Amazon)"
			data={providerCounts}
			lists={providerDataLists}
		/>
	);
};
