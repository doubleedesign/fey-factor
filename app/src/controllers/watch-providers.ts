import { providerOrder } from '../constants.tsx';
import { Provider } from '../types';

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
// TODO: Move this to the server layer to avoid exposing the API key
export const fetchWatchProviders = async () => {
	try {
		const response = await fetch(`https://api.themoviedb.org/3/watch/providers/tv?watch_region=AU&api_key=${apiKey}`);

		return await response.json();
	}
	catch (error) {
		console.error('Error fetching providers: ', error);

		return [];
	}
};
