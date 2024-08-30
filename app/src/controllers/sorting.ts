import { Row } from '../types.ts';

export default {
	sortBy: (rows: Row[], field: keyof Row, order: 'asc' | 'desc'): Row[] => {
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
			if (aValue > bValue) {
				return order === 'asc' ? 1 : -1;
			}
			if (aValue < bValue) {
				return order === 'asc' ? -1 : 1;
			}

			return 0;
		});
	},
};
