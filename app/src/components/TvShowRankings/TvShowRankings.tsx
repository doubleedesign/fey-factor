import { FC } from 'react';
import { StyledTvShowRankings } from './TvShowRankings.style';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { App_RankedShowsQuery, App_RankedShowsQuery$data } from '../../__generated__/App_RankedShowsQuery.graphql.ts';
import { Row } from '../../types.ts';
import { SortableTable } from '../SortableTable/SortableTable.tsx';

type TvShowRankingsProps = {
	limit: number;
};

export const TvShowRankings: FC<TvShowRankingsProps> = ({ limit }) => {

	const result = useLazyLoadQuery<App_RankedShowsQuery>(
		graphql`
            query App_RankedShowsQuery($limit: Int!) {
                TvShows(limit: $limit) {
                    ...on TvShowWithRankingData {
                        id @required(action: LOG)
                        title @required(action: LOG)
                        total_connections
                        average_degree
                        weighted_score
                    }
                }
            }
		`,
		{ limit }
	);

	const data = result.TvShows?.map((show: NonNullable<App_RankedShowsQuery$data['TvShows']>[number]) => {
		return {
			id: show?.id ?? 0,
			title: show?.title ?? '',
			total_connections: show?.total_connections ?? 0,
			average_degree: show?.average_degree?.toFixed(2) ?? 0,
			weighted_score: show?.weighted_score?.toFixed(2) ?? 0,
		} as Row;
	});

	return (
		<StyledTvShowRankings data-testid="TvShowRankings">
			<SortableTable initialData={data ?? []} />
		</StyledTvShowRankings>
	);
};
