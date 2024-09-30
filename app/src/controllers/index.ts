import { providerOrder } from '../constants.tsx';
import { Filters, Provider, Row } from '../types';

export const datawranglers = {
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

export const sortProviders = (providers: Provider[]) => {
	const order = Array.from(new Set([...providerOrder, ...providers]));

	return [...providers].sort((a, b) => {
		const indexA = order.indexOf(a.provider_name);
		const indexB = order.indexOf(b.provider_name);

		if (indexA !== -1 && indexB !== -1) {
			return indexA - indexB;
		}
		else if (indexA !== -1) {
			return -1;
		}
		else if (indexB !== -1) {
			return 1;
		}
		else {
			return a.provider_name.localeCompare(b.provider_name);
		}
	});
};

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
export const fetchWatchProviders = async () => {
	try {
		const response = await fetch(`https://api.themoviedb.org/3/watch/providers/tv?watch_region=AU&api_key=${apiKey}`);

		return await response.json();
	}
	catch (error) {
		console.error('Error fetching providers: ', error);
	}
};
