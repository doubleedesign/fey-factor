import * as dotenv from 'dotenv';
import { Provider } from '../types';

dotenv.config();

function wait(time:number) {
	return new Promise(resolve => setTimeout(resolve, time));
}

export class TmdbApiConnection {
	authToken: string;
	baseUrl: string = 'https://api.themoviedb.org/3';

	constructor() {
		this.authToken = process.env.TMDB_AUTH_TOKEN as string;
	}

	/**
	 * Utility function for making GET requests to the TMDB API
	 * so that I can easily and consistently do things like log when requests are made
	 * and if I want to add file-based caching like the builder has, I can do it in one place
	 * @param url
	 * @param method
	 * @param data
	 * @param useCached
	 */
	async makeFetchHappen(url: string, method: string, data?: unknown, useCached = true) {
		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Authorization': `Bearer ${this.authToken}`,
					'Cache-Control': 'max-age=86400', // 24 hours
				},
				cache: useCached ? 'default' : 'no-store'
			});

			return response.json();
		}
		catch (error) {
			if (error.response && error.response.status === 429) {
				console.warn('Rate limit exceeded. Waiting for 30 seconds before retrying...');
				await wait(30000);

				return this.makeFetchHappen(url, method, data); // Retry the request
			}
			else if(url.endsWith('watch/providers') && error.message === 'fetch failed') {
				return null;
			}
			else {
				console.error(`Error ${error?.response?.status}: ${error?.response?.statusText} for request to ${url}`);

				return null;
			}
		}
	}
	
	async getWatchProviders(tvShowId: number) {
		try {
			const data = await this.makeFetchHappen(`${this.baseUrl}/tv/${tvShowId}/watch/providers`, 'GET');
			if (!data?.results || !data.results['AU']) return [];

			return Object.entries(data.results['AU']).reduce((acc: Provider[], [key, values]: [string, Partial<Provider>[]]) => {
				if (key === 'link') return acc;

				values.forEach((provider: Provider) => {
					if (provider.provider_name === 'Netflix basic with Ads') return;
					acc.push({
						...provider,
						provider_type: key
					});
				});

				return acc;
			}, []);
		}
		catch(error) {
			console.error(error.message);

			return [];
		}
	}

	async getTvShowDetails(tvShowId: number) {
		try {
			return await this.makeFetchHappen(`${this.baseUrl}/tv/${tvShowId}`, 'GET');
		}
		catch(error) {
			console.error(error.message);

			return null;
		}
	}
}