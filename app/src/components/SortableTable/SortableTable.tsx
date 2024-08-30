import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { datawranglers } from '../../controllers';
import { SortingButton } from '../SortingButton/SortingButton.tsx';
import { StyledSortableTable } from './SortableTable.style.ts';
import { Row } from '../../types.ts';
import { Container } from '../common.ts';

type SortableTableProps = {
	initialData: Row[];
};

export const SortableTable: FC<SortableTableProps> = ({ initialData }) => {
	// The data set that will be displayed - allows for sorting, filtering, etc. without mutating the original data
	const [data, setData] = useState<Row[]>(initialData);
	const [activeSortField, setActiveSortField] = useState<string>('weighted_score');

	// Re-sync `data` state with `initialData` prop whenever it changes
	useEffect(() => {
		setData(initialData);
	}, [initialData]);

	const columns = [
		{ value: 'id', label: 'ID' },
		{ value: 'title', label: 'Title' },
		{ value: 'total_connections', label: 'Total Connections' },
		{ value: 'average_degree', label: 'Average Degree' },
		{ value: 'weighted_score', label: 'Weighted Score' },
	];
	const sortableColumns = columns.filter(column => column.value !== 'id');

	const [ordering, setOrdering] = useState<{ [key: string]: 'asc' | 'desc' }>(() => {
		const order = {};
		sortableColumns.forEach(column => {
			Object.assign(order, { [column.value]: 'asc' });
		});

		return order;
	});

	const handleSort = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		const sort = (field: string, order: 'asc' | 'desc') => {
			setData(datawranglers.sort(data, field, order));
		};

		const field = event.currentTarget.closest('th')?.dataset.fieldkey;
		if(field) {
			const newOrder = ordering[field] === 'asc' ? 'desc' : 'asc';
			sort(field, newOrder);
			setActiveSortField(field);
			setOrdering(prevOrdering => ({
				...prevOrdering,
				[field]: newOrder,
			}));
		}
	}, [data, ordering]);

	const cellContent = (row: Row, columnValue: string) => {
		// @ts-ignore
		return row[columnValue];
	};

	return (
		data && (
			<Container>
				<StyledSortableTable>
					<thead>
						<tr>
							{columns.map((column) => (
								<th key={column.value} data-fieldkey={column.value}>
									{sortableColumns.find(sortable => column.value === sortable.value) ? (
										<SortingButton label={column.label}
											direction={ordering[column.value]}
											onClick={handleSort}
											active={activeSortField === column.value}/>
									) : (
										<>{column.label}</>
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row) => (
							<tr key={`row-${row.id}`}>
								{columns.map((column, columnIndex) => (
									<td key={columnIndex} data-fieldkey={column.value}>
										{cellContent(row, column.value)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</StyledSortableTable>
			</Container>
		)
	);
};

