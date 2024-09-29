import * as dotenv from 'dotenv';
import { Provider } from '../types';
dotenv.config();

export class TmdbApiConnection {
	authToken: string;
	baseUrl: string = 'https://api.themoviedb.org/3';

	constructor() {
		this.authToken = process.env.TMDB_AUTH_TOKEN as string;
	}
	
	async getWatchProviders(tvShowId: number) {
		try {
			const response = await fetch(`${this.baseUrl}/tv/${tvShowId}/watch/providers`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.authToken}`,
					'Cache-Control': 'max-age=86400', // 24 hours
				},
				cache: 'default'
			});

			const data = await response.json();

			if (!data.results['AU']) return [];

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
}