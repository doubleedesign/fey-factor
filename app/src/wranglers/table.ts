import { Filters, Row } from '../types.ts';

export const tableDataWranglers = {
	sort: (rows: Row[], field: keyof Row, order: 'asc' | 'desc'): Row[] => {
		return rows.sort((a, b) => {
			let aValue = a[field];
			let bValue = b[field];

			// Check if values are strings and can be converted to numbers
			if (typeof aValue === 'string' && !isNaN(Number(aValue))) {
				aValue = Number(aValue);
			}
			if (typeof bValue === 'string' && !isNaN(Number(bValue))) {
				bValue = Number(bValue);
			}

			// Check if the values are strings
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				const comparison = aValue.localeCompare(bValue);

				return order === 'asc' ? comparison : -comparison;
			}

			// Otherwise, assume the values are numbers or comparable
			if (aValue! > bValue!) {
				return order === 'asc' ? 1 : -1;
			}
			if (aValue! < bValue!) {
				return order === 'asc' ? -1 : 1;
			}

			return 0;
		});
	},
	filter: (rows: Row[], filters: Filters): Row[] => {
		// No filters are active, bail early
		if(Object.keys(filters).length === 0) return rows;

		return rows.filter(row => {
			return Object.entries(filters).every(([key, values]) => {
				if (key === 'available_on') {
					if(values.length === 0) return true;

					return row.available_on?.some(provider => values.includes(provider.provider_id.toString())) ?? false;
				}

				return false;
			});
		});
	}
};