import { FC, ReactNode } from 'react';
import { SortingButton } from '../SortingButton/SortingButton.tsx';
import { StyledSortableTable } from './SortableTable.style.ts';
import { Row } from '../../../types.ts';
import { ShowCard } from '../../data-presentation';
import { ProviderLogos } from '../../misc/ProviderLogos/ProviderLogos.tsx';
import Skeleton from 'react-loading-skeleton';
import { useRankingContext } from '../../../controllers/RankingContext.tsx';
import { kebabCase } from 'lodash';


export const SortableTable: FC = () => {
	const { data, columns, sortableColumns, visibleColumns, alwaysVisibleColumns, sort, activeSortField, ordering } = useRankingContext();

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
					{columns.map((column) => {
						const isAlwaysVisible = alwaysVisibleColumns.includes(column.value);
						const isVisible = visibleColumns.some(visible => column.value === visible.value);
						const isSortable = sortableColumns.some(sortable => column.value === sortable.value);

						if (!isAlwaysVisible && !isVisible) {
							return null;
						}

						return (
							<th key={column.value} data-fieldkey={column.value}>
								{isSortable ? (
									<SortingButton
										label={column.label}
										direction={ordering[column.value]}
										onClick={sort}
										active={activeSortField === column.value}
										tooltip={column.tooltip}
									/>
								) : (
									column.label
								)}
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{data && data.map((row) => (
					<tr key={`row-${row.id}-${kebabCase(row.title)}`} data-loaded={row.id > 0}>
						{columns.map((column, columnIndex) => (
							[...alwaysVisibleColumns, ...visibleColumns.map(col => col.value)]
								.includes(column.value) && <td key={columnIndex} data-fieldkey={column.value}>
								{cellContent(row, column.value)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</StyledSortableTable>
	);
};

