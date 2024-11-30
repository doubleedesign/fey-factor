import { Column, Row, Filters } from '../types.ts';
import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useState, useMemo, useEffect } from 'react';
import { tableDataWranglers } from '../wranglers/table.ts';

type RankingContextState = {
	degreeZero: number;
	// Raw data can be set from outside this context, but not directly retrieved - it is used to populate the `data` state
	setRawData: (data: (prevState: Row[]) => Row[]) => void;
	// It is intended that the data can only be manipulated through the context, not directly
	data: Row[];
	columns: Column[];
	setColumns: (columns: Column[]) => void;
	sortableColumns: Column[];
	alwaysVisibleColumns: string[];
	defaultVisibleColumns: string[];
	visibleColumns: Pick<Column, 'label' | 'value'>[];
	setVisibleColumns: (columns: Pick<Column, 'label' | 'value'>[]) => void;
	activeSortField: string;
	sort: (event: React.MouseEvent<HTMLButtonElement>) => void;
	filter: (filters: Filters) => void;
	ordering: { [key: string]: 'asc' | 'desc' };
};

export const RankingContext = createContext({} as RankingContextState);

export const RankingContextProvider: FC<PropsWithChildren> = ({ children }) => {
	// The complete current data set as initially fetched
	const [rawData, setRawData] = useState<Row[]>([]);
	// The data set that will be displayed - can be sorted, filtered, grouped, etc.
	const [data, setData] = useState<Row[]>([]);
	// Table data and sorting
	const [columns, setColumns] = useState<Column[]>([]);
	const [sortableColumns, setSortableColumns] = useState<Column[]>([]);
	const alwaysVisibleColumns = ['rank', 'id', 'title']; // columns that are not part of the visible/not visible toggles
	const defaultVisibleColumns = useMemo(() => ['episode_count', 'weighted_score', 'available_on'], []); // columns that are visible by default
	const [visibleColumns, setVisibleColumns] = useState<Pick<Column, 'label' | 'value'>[]>([]); // currently visible columns other than the always visible ones
	const [activeSortField, setActiveSortField] = useState<string>('weighted_score');
	const [ordering, setOrdering] = useState<{ [key: string]: 'asc' | 'desc' }>(() => {
		const order = {};
		sortableColumns.forEach(column => {
			Object.assign(order, { [column.value]: 'asc' });
		});

		return order;
	});

	// Re-sync `data` state with `rawData` prop whenever it changes
	useEffect(() => {
		setData(rawData);
	}, [rawData]);

	// Set visible and sortable columns when columns are set
	// This is in this component's state because the sortable columns are then used for the ordering state
	// TODO: Put visible columns in local storage
	useEffect(() => {
		setSortableColumns(columns.filter(column => ['episode_count', 'total_connections', 'average_degree', 'weighted_score'].includes(column.value)));
		setVisibleColumns(columns.filter(column => defaultVisibleColumns.includes(column.value)));
	}, [columns, defaultVisibleColumns]);

	// Sort the data when active sort field changes
	const handleSort = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		const field = event.currentTarget.closest('th')?.dataset.fieldkey as keyof Row;
		if(field) {
			const newOrder = ordering[field] === 'asc' ? 'desc' : 'asc';
			setData(tableDataWranglers.sort(data, field, newOrder));
			setActiveSortField(field);
			setOrdering(prevOrdering => ({
				...prevOrdering,
				[field]: newOrder,
			}));
		}
	}, [data, ordering]);

	// Handle filtering
	const handleFilter = useCallback((filters: Filters) => {
		setData(tableDataWranglers.filter(rawData, filters));
	}, [rawData]);

	return (
		<RankingContext.Provider value={{
			degreeZero: 56323,
			setRawData,
			data,
			columns, setColumns,
			sortableColumns,
			visibleColumns, setVisibleColumns,
			alwaysVisibleColumns,
			defaultVisibleColumns: ['episode_count', 'weighted_score', 'available_on'],
			activeSortField,
			sort: handleSort,
			filter: handleFilter,
			ordering
		}}>
			{children}
		</RankingContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRankingContext = () => {
	const context = useContext(RankingContext);
	if (context === undefined) {
		throw new Error('useRankingContext must be used within a RankingProvider');
	}

	return context;
};