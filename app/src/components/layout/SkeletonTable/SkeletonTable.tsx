import { FC } from 'react';
import { StyledSkeletonTable } from './SkeletonTable.style';
import { Column } from '../../../types.ts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type SkeletonTableProps = {
	rows: number;
};

export const SkeletonTable: FC<SkeletonTableProps> = ({ rows }) => {
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
		<StyledSkeletonTable data-testid="SkeletonTable">
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
		</StyledSkeletonTable>
	);
};
