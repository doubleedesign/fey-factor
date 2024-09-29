import sorter from './sorting';
import { providerOrder } from '../constants.tsx';
import { Provider } from '../types';

export const datawranglers = {
	sort: sorter.sortBy,
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
