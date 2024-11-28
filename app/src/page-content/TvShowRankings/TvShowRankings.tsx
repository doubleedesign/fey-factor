import { FC, useEffect } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { TvShowRankingsQuery, TvShowRankingsQuery$data } from '../../__generated__/TvShowRankingsQuery.graphql.ts';
import { SortableTable } from '../../components/data-presentation';
import { Column, Row } from '../../types.ts';
import { useRankingContext } from '../../controllers/RankingContext.tsx';
import * as Case from 'case';

type TvShowRankingsProps = {
	limit: number;
	loadingRows: number;
};

const COLUMN_TOOLTIP_MAP: Record<Column['value'] | string, string> = {
	rank: 'Ranking based on weighted score',
	id: 'The Movie Database ID',
	title: 'Title',
	episode_count: 'The number of episodes',
	total_connections: 'The total number of people who meet inclusion criteria for this show',
	average_degree: 'The average degree of separation between the show\'s connections and Tina Fey',
	// eslint-disable-next-line max-len
	weighted_score: 'A score that uses total connections, average degree, and the proportional involvement of each connected person across the show\'s run to assign a ranking',
	available_on: 'Available on'
};

export const TvShowRankings: FC<TvShowRankingsProps> = ({ limit, loadingRows }) => {
	const { setRawData, setColumns, setSortableColumns, setVisibleColumns, alwaysVisibleColumns } = useRankingContext();

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
		const rowData: Row[] = result.TvShows?.map((show: NonNullable<TvShowRankingsQuery$data['TvShows']>[number], index) => {
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
		}) ?? [];

		setRawData(() => rowData ?? []);
		const cols = Object.keys(rowData[0]).map(column => {
			return {
				value: column,
				label: column === 'id' ? 'ID' : Case.sentence(column),
				tooltip: COLUMN_TOOLTIP_MAP[column]
			};
		}) as Column[];
		
		setColumns(cols);
		setVisibleColumns(cols.filter(column => !alwaysVisibleColumns.includes(column.value)));
		setSortableColumns(cols.filter(column => ['episode_count', 'total_connections', 'average_degree', 'weighted_score'].includes(column.value)));
	}, [result.TvShows, setColumns, setRawData, setSortableColumns, setVisibleColumns]);

	useEffect(() => {
		if(loadingRows > 0) {
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
		else {
			// Remove any loading rows that are present
			setRawData(prevState => prevState.filter(row => row.title !== 'Loading...'));
		}
	}, [loadingRows, setRawData]);

	return (
		<div data-testid="TvShowRankings">
			<SortableTable />
		</div>
	);
};
