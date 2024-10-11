import { Column, Row, Filters } from '../../types.ts';
import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { datawranglers } from '../index.ts';

type RankingContextState = {
	// Raw data can be set from outside this context, but not directly retrieved - it is used to populate the `data` state
	setRawData: (data: (prevState: Row[]) => Row[]) => void;
	// It is intended that the data can only be manipulated through the context, not directly
	data: Row[];
	columns: Column[];
	setColumns: (columns: Column[]) => void;
	sortableColumns: Column[];
	setSortableColumns: (columns: Column[]) => void;
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
	// Sorting
	const [columns, setColumns] = useState<Column[]>([]);
	const [sortableColumns, setSortableColumns] = useState<Column[]>([]);
	const [activeSortField, setActiveSortField] = useState<string>('weighted_score');
	const [ordering, setOrdering] = useState<{ [key: string]: 'asc' | 'desc' }>(() => {
		const order = {};
		sortableColumns.forEach(column => {
			Object.assign(order, { [column.value]: 'asc' });
		});

		return order;
	});

	// Re-sync `data` state with `rawlData` prop whenever it changes
	useEffect(() => {
		setData(rawData);
	}, [rawData]);
	
	// Sort the data when active sort field changes
	const handleSort = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		const field = event.currentTarget.closest('th')?.dataset.fieldkey as keyof Row;
		if(field) {
			const newOrder = ordering[field] === 'asc' ? 'desc' : 'asc';
			setData(datawranglers.sort(data, field, newOrder));
			setActiveSortField(field);
			setOrdering(prevOrdering => ({
				...prevOrdering,
				[field]: newOrder,
			}));
		}
	}, [data, ordering]);

	const handleFilter = useCallback((filters: Filters) => {
		setData(datawranglers.filter(rawData, filters));
	}, [rawData]);

	return (
		<RankingContext.Provider value={{
			setRawData,
			data,
			columns, setColumns,
			sortableColumns, setSortableColumns,
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