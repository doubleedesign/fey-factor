import { FC, useState, useCallback } from 'react';
import { StyledSortableTable } from './SortableTable.style.ts';
import { Tooltip } from 'react-tooltip';
import { SortingButton } from '../SortingButton/SortingButton.tsx';

type Column = {
	value: string;
	label: string;
};

type ColumnValues = {
	value: string;
	values: string[];
};

type SortableTableProps = {
	data: any[];
	columns: Column[];
	sortableColumns: Column[];
	sort: (field: string, order: 'asc' | 'desc') => void;
};

export const SortableTable: FC = ({ data, columns, sortableColumns, sort }: SortableTableProps) => {
	const [ordering, setOrdering] = useState<{ [key: string]: 'asc' | 'desc' }>(() => {
		const order = {};
		sortableColumns.forEach(column => {
			Object.assign(order, { [column.value]: 'asc' });
		});

		return order;
	});
	const [activeSortField, setActiveSortField] = useState<string>('weighted_score');

	const handleSort = useCallback((e) => {
		const field = e.currentTarget.closest('th').dataset.fieldkey;
		const newOrder = ordering[field] === 'asc' ? 'desc' : 'asc';

		sort(field, newOrder);

		setActiveSortField(field);

		setOrdering(prevOrdering => ({
			...prevOrdering,
			[field]: newOrder,
		}));
	}, [sort, ordering]);


	return (
		<StyledSortableTable>
			<thead>
				<tr>
					{columns.map((column, index) => (
						<th key={column.value} data-fieldkey={column.value}>
							{sortableColumns.find(sortable => column.value === sortable.value) ? (
								// eslint-disable-next-line max-len
								<SortingButton label={column.label} direction={ordering[column.value]} onClick={handleSort} active={activeSortField === column.value}/>
							) : (
								<>{column.label}</>
							)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((row, rowIndex) => (
					<tr key={rowIndex}>
						{columns.map((column, columnIndex) => (
							<td key={columnIndex} data-fieldkey={column.value}>
								{column.value}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</StyledSortableTable>
	);
};