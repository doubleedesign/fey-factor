import { FC } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { TvShowRankingsQuery, TvShowRankingsQuery$data } from '../../__generated__/TvShowRankingsQuery.graphql.ts';
import { SortableTable } from '../../components/data-presentation';
import { Row } from '../../types.ts';

type TvShowRankingsProps = {
	limit: number;
};

export const TvShowRankings: FC<TvShowRankingsProps> = ({ limit }) => {

	const result = useLazyLoadQuery<TvShowRankingsQuery>(
		graphql`
            query TvShowRankingsQuery($limit: Int!) {
                TvShows(limit: $limit) {
                    id
                    title
                    rankingData {
                        total_connections
                        average_degree
                        weighted_score
                    }
                }
            }
		`,
		{ limit }
	);

	const data = result.TvShows?.map((show: NonNullable<TvShowRankingsQuery$data['TvShows']>[number]) => {
		return {
			id: show?.id ?? 0,
			title: show?.title ?? '',
			total_connections: show?.rankingData?.total_connections ?? 0,
			average_degree: show?.rankingData?.average_degree?.toFixed(2) ?? 0,
			weighted_score: show?.rankingData?.weighted_score?.toFixed(2) ?? 0,
		} as Row;
	});

	return (
		<div data-testid="TvShowRankings">
			<SortableTable initialData={data ?? []} />
		</div>
	);
};
