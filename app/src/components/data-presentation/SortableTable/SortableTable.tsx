import { FC, ReactNode, useEffect } from 'react';
import { SortingButton } from '../SortingButton/SortingButton.tsx';
import { StyledSortableTable } from './SortableTable.style.ts';
import { Row } from '../../../types.ts';
import { ShowCard } from '../../data-presentation';
import { ProviderLogos } from '../../misc/ProviderLogos/ProviderLogos.tsx';
import Skeleton from 'react-loading-skeleton';
import { useRankingContext } from '../../../controllers/context/RankingContext.tsx';
import { kebabCase } from 'lodash';


export const SortableTable: FC = () => {
	const { data, columns, setColumns, sortableColumns, setSortableColumns, sort, activeSortField, ordering } = useRankingContext();

	useEffect(() => {
		setColumns([
			{ value: 'rank', label: 'Rank', tooltip: 'Ranking based on weighted score' },
			{ value: 'id', label: 'ID', tooltip: 'The Movie Database ID' },
			{ value: 'title', label: 'Title' },
			{ value: 'episode_count', label: 'Episodes' },
			{
				value: 'total_connections',
				label: 'Connections',
				tooltip: 'The total number of people who meet inclusion criteria for this show'
			},
			{
				value: 'average_degree',
				label: 'Avg. Degree',
				tooltip: 'The average degree of separation between the show\'s connections and Tina Fey'
			},
			{
				value: 'weighted_score',
				label: 'Weighted Score',
				// eslint-disable-next-line max-len
				tooltip: 'A score that uses total connections, average degree, and the proportional involvement of each connected person across the show\'s run to assign a ranking'
			},
			{ value: 'available_on', label: 'Available on' }
		]);

		setSortableColumns([
			{ value: 'episode_count', label: 'Episodes' },
			{ value: 'total_connections', label: 'Connections' },
			{ value: 'average_degree', label: 'Avg. Degree' },
			{ value: 'weighted_score', label: 'Weighted Score' }
		]);
	}, [setColumns, setSortableColumns]);

	const cellContent = (row: Row, columnValue: string): ReactNode => {
		if(columnValue === 'title') {
			return row.title === 'Loading...' ? (
				<Skeleton/>
			) : (
				<ShowCard id={row.id} expandable />
			);
		}

		// Extra rows added while data is loading uses negative values so we can identify them here easily
		// (negative numbers shouldn't occur in the actual data)
		if((typeof row[columnValue as keyof Row] == 'number') && ((row[columnValue as keyof Row] as number) < 1)) {
			return '';
		}

		if(columnValue === 'available_on') {
			return <ProviderLogos providers={row.available_on ?? []} />;
		}

		return <>{row[columnValue as keyof Row]}</>;
	};

	return (
		<StyledSortableTable>
			<thead>
				<tr>
					{columns.map((column) => (
						<th key={column.value} data-fieldkey={column.value}>
							{sortableColumns.find(sortable => column.value === sortable.value) ? (
								<SortingButton label={column.label}
									direction={ordering[column.value]}
									onClick={sort}
									active={activeSortField === column.value}
									tooltip={column.tooltip}
								/>
							) : (
								<>{column.label}</>
							)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data && data.map((row) => (
					<tr key={`row-${row.id}-${kebabCase(row.title)}`} data-loaded={row.id > 0}>
						{columns.map((column, columnIndex) => (
							<td key={columnIndex} data-fieldkey={column.value}>
								{cellContent(row, column.value)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</StyledSortableTable>
	);
};

