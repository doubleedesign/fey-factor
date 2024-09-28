import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { datawranglers } from '../../../controllers';
import { SortingButton } from '../SortingButton/SortingButton.tsx';
import { StyledSortableTable } from './SortableTable.style.ts';
import { Row, Column } from '../../../types.ts';
import { TooltippedElement } from '../../typography';
import { Expandable } from '../../layout';
import { ShowCard } from '../../data-presentation';
import { ProviderLogos } from '../../misc/ProviderLogos/ProviderLogos.tsx';

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

	const columns: Column[] = [
		{ value: 'rank', label: 'Rank', tooltip: 'Sort by a numeric score to see numbering' },
		{ value: 'id', label: 'ID', tooltip: 'The Movie Database ID' },
		{ value: 'title', label: 'Title' },
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
	];
	const sortableColumns = columns.filter(column => !['rank', 'id', 'available_on'].includes(column.value));

	const [ordering, setOrdering] = useState<{ [key: string]: 'asc' | 'desc' }>(() => {
		const order = {};
		sortableColumns.forEach(column => {
			Object.assign(order, { [column.value]: 'asc' });
		});

		return order;
	});

	const handleSort = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		const sort = (field: keyof Row, order: 'asc' | 'desc') => {
			setData(datawranglers.sort(data, field, order));
		};

		const field = event.currentTarget.closest('th')?.dataset.fieldkey as keyof Row;
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

	const cellContent = (row: Row, columnValue: string): ReactNode => {
		if(columnValue === 'title') {
			return (
				<Expandable title={row.title}>
					<ShowCard id={row.id}/>
				</Expandable>
			);
		}

		if(columnValue === 'available_on') {
			return <ProviderLogos providers={row.available_on ?? []} />;
		}

		return <>{row[columnValue as keyof Row]}</>;
	};

	return (
		data && (
			<StyledSortableTable>
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column.value} data-fieldkey={column.value}>
								{sortableColumns.find(sortable => column.value === sortable.value) ? (
									<SortingButton label={column.label}
										direction={ordering[column.value]}
										onClick={handleSort}
										active={activeSortField === column.value}
										tooltip={column.tooltip}
									/>
								) : (
									<>{(column.value === 'rank' && activeSortField === 'title' && column.tooltip)
										? <TooltippedElement id="rank-tooltip" tooltip={column.tooltip} position="bottom">{column.label}</TooltippedElement>
										: column.label}
									</>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={`row-${row.id}`}>
							{columns.map((column, columnIndex) => (
								<td key={columnIndex} data-fieldkey={column.value}>
									{column.label === 'Rank'
										? (activeSortField === 'title' ? '-' : rowIndex + 1)
										: cellContent(row, column.value)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</StyledSortableTable>
		)
	);
};

