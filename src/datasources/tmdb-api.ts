import axios from 'axios';
import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as dotenv from 'dotenv';
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

	savetoCache(path: string, filename: string, data: object) {
		if (!existsSync(path)){
			mkdirSync(path, { recursive: true });
		}

		writeFileSync(`${path}/${filename}`, JSON.stringify(data, null, 4));
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

			this.savetoCache(`./cache/person/${id}/`, 'tv_credits.json', response.data);
			return response.data;
		}
		catch (error) {
			console.error(chalk.red(`getTvCreditsForPerson\t ${id}\t ${error.message}`));
		}
	}

	async getPersonDetails(id: number) {
		try {
			const response = await axios.request({
				url: `${this.baseUrl}/person/${id}`,
				method: 'get',
				headers: {
					'Authorization': `Bearer ${this.authToken}`
				}
			});

			this.savetoCache(`./cache/person/${id}/`, 'index.json', response.data);
			return response.data;
		}
		catch (error) {
			console.error(chalk.red(`getPersonDetails\t ${id}\t ${error}`));
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

			this.savetoCache(`./cache/tv/${id}/`, 'index.json', response.data);
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

			this.savetoCache(`./cache/tv/${id}/`, 'aggregate_credits.json', response.data);
			return response.data;
		}
		catch(error) {
			console.error(chalk.red(`getTvShowCredits\t ${id}\t ${error}`));
		}
	}
}
