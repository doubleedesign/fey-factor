import { FC } from 'react';
import { StyledTableSkeleton } from './TableSkeleton.style';
import { Column } from '../../../../types.ts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type TableSkeletonProps = {
	rows: number;
};

export const TableSkeleton: FC<TableSkeletonProps> = ({ rows }) => {
	const columns: Column[] = [
		{ value: 'rank', label: 'Rank' },
		{ value: 'id', label: 'ID' },
		{ value: 'title', label: 'Title' },
		{
			value: 'total_connections',
			label: 'Connections',
		},
		{
			value: 'average_degree',
			label: 'Avg. Degree',
		},
		{
			value: 'weighted_score',
			label: 'Weighted Score',
		},
		{ value: 'available_on', label: 'Available on' }
	];

	return (
		<StyledTableSkeleton data-testid="TableSkeleton">
			<thead>
				<tr>
					{columns.map((column) => (
						<th key={column.value} data-fieldkey={column.value}>
							{column.label}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{Array.from({ length: rows }).map((_, index) => (
					<tr key={index}>
						{columns.map((column) => (
							<td key={column.value} data-fieldkey={column.value}>
								<Skeleton />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</StyledTableSkeleton>
	);
};
