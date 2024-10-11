import { FC, useEffect } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { TvShowRankingsQuery, TvShowRankingsQuery$data } from '../../__generated__/TvShowRankingsQuery.graphql.ts';
import { SortableTable } from '../../components/data-presentation';
import { Row } from '../../types.ts';
import { useRankingContext } from '../../controllers/context/RankingContext.tsx';

type TvShowRankingsProps = {
	limit: number;
	loadingRows: number;
};

export const TvShowRankings: FC<TvShowRankingsProps> = ({ limit, loadingRows }) => {
	const { setRawData, data } = useRankingContext();

	const result = useLazyLoadQuery<TvShowRankingsQuery>(
		graphql`
            query TvShowRankingsQuery($limit: Int!) {
                TvShows(limit: $limit) {
					__typename
                    id
                    title
					episode_count
                    rankingData {
                        total_connections
                        average_degree
                        weighted_score
                    }
	                providers(filter: { provider_type: ["flatrate", "free"] }) {
		                provider_id
		                provider_name
		                provider_type
                        logo_path
                    }
                }
            }
		`,
		{ limit },
		{ fetchPolicy: 'store-or-network' }
	);

	useEffect(() => {
		const rowData = result.TvShows?.map((show: NonNullable<TvShowRankingsQuery$data['TvShows']>[number], index) => {
			return {
				rank: index + 1,
				id: show?.id ?? 0,
				title: show?.title ?? '',
				episode_count: show?.episode_count ?? 0,
				total_connections: show?.rankingData?.total_connections ?? 0,
				average_degree: show?.rankingData?.average_degree?.toFixed(2) ?? 0,
				weighted_score: show?.rankingData?.weighted_score?.toFixed(2) ?? 0,
				available_on: show?.providers
			} as Row;
		});

		setRawData(() => rowData ?? []);
	}, [result.TvShows, setRawData]);

	useEffect(() => {
		//console.log(data.length, ' items,', loadingRows, ' loading rows');
		if(loadingRows >= data.length) {
			const skeletonRows: Row[] = Array.from({ length: loadingRows }, (_, index) => {
				return {
					id: -index,
					title: 'Loading...',
					total_connections: -1,
					average_degree: -1,
					weighted_score: -1
				} as Row;
			});

			setRawData(prevState => [...prevState, ...skeletonRows]);
		}
	}, [data.length, loadingRows, setRawData]);

	return (
		<div data-testid="TvShowRankings">
			<SortableTable />
		</div>
	);
};
