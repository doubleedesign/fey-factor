import axios from 'axios';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

/**
 * Class to interact with the TMDB API
 */
export class TmdbApi {
	authToken: string;
	baseUrl: string = 'https://api.themoviedb.org/3';

	constructor() {
		this.authToken = process.env.TMDB_AUTH_TOKEN;
	}

	async getTvCreditsForPerson(id: number) {
		try {
			const response = await axios.request({
				url: `${this.baseUrl}/person/${id}/tv_credits`,
				method: 'get',
				headers: {
					'Authorization': `Bearer ${this.authToken}`
				}
			});

			return response.data;
		}
		catch (error) {
			console.error(chalk.red(`getTvCreditsForPerson\t ${id}\t ${error}`));
		}
	}

	async getTvShowDetails(id: number) {
		try {
			const response = await axios.request({
				url: `${this.baseUrl}/tv/${id}`,
				method: 'get',
				headers: {
					'Authorization': `Bearer ${this.authToken}`
				}
			});

			return response.data;
		}
		catch(error) {
			console.error(chalk.red(`getTvShowDetails\t ${id}\t ${error}`));
		}
	}

	async getTvShowCredits(id: number) {
		try {
			const response = await axios.request({
				url: `${this.baseUrl}/tv/${id}/aggregate_credits`,
				method: 'get',
				headers: {
					'Authorization': `Bearer ${this.authToken}`
				}
			});

			return response.data;
		}
		catch(error) {
			console.error(chalk.red(`getTvShowCredits\t ${id}\t ${error}`));
		}
	}
}