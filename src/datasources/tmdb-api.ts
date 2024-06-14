import axios from 'axios';
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync, createWriteStream, WriteStream } from 'fs';
import * as dotenv from 'dotenv';
import { customConsole, logToFile, wait } from '../common.ts';

dotenv.config();

/**
 * Class to interact with the TMDB API
 */
export class TmdbApi {
	authToken: string;
	baseUrl: string = 'https://api.themoviedb.org/3';
	logFile: WriteStream;

	constructor() {
		this.authToken = process.env.TMDB_AUTH_TOKEN;
		this.logFile = createWriteStream('./logs/tmdb-api.log');
	}

	async makeRequest(url: string, method: string, data?: any, useCached = true) {
		// If data is cached in a JSON file in src/cache, use that
		const cachePath = this.getCachedFilePath(url);
		if(useCached && existsSync(cachePath)) {
			try {
				customConsole.info(`Using cached data for ${url}`, false);
				const data = readFileSync(cachePath, 'utf-8');
				return JSON.parse(data);
			}
			catch (error) {
				customConsole.error(`Error reading cached data from ${cachePath}: ${error.message}`);
				logToFile(this.logFile, `Error reading cached data from ${cachePath}: ${error.message}`);
				// Assume file is dodgy and delete it
				unlinkSync(cachePath);

				return await this.makeRequest(url, method, data, false);
			}
		}

		customConsole.info(`No cached data at ${cachePath}, making request to ${url}...`);
		try {
			const response = await axios.request({
				url: url,
				method: method,
				headers: {
					'Authorization': `Bearer ${this.authToken}`
				},
				data: data
			});

			return response.data;
		}
		catch (error) {
			if (error.response && error.response.status === 429) {
				customConsole.warn('Rate limit exceeded. Waiting for 30 seconds before retrying...');
				await wait(30000);

				return this.makeRequest(url, method, data); // Retry the request
			}
			else if(error?.response && error?.response?.status) {
				customConsole.error(`Error ${error.response?.status}: ${error.response?.statusText} for request to ${url}`);
				logToFile(this.logFile,
					`Error ${error.response?.status}: ${error.response?.statusText} for request to ${url}. \t${error.message}`
				);

				return null;
			}
			else {
				customConsole.error(`Error ${error?.response?.status}: ${error?.response?.statusText} for request to ${url}`);
				logToFile(this.logFile,
					`Error ${error?.response?.status}: ${error?.response?.statusText} for request to ${url}. \t${error.message}`
				);

				return null;
			}
		}
	}

	getCachedFilePath(url: string) {
		const cachePath = url.replace(this.baseUrl, './src/datasources/cache');
		const pieces = cachePath.split('/').reverse();

		if(pieces[0] === 'aggregate_credits' || pieces[0] === 'tv_credits') {
			return cachePath + '.json';
		}

		return cachePath + '/index.json';
	}

	savetoCache(path: string, filename: string, data: object) {
		if(!data) return;
		const fullPath = `./src/datasources/cache${path}`;
		if (!existsSync(fullPath)) {
			mkdirSync(fullPath, { recursive: true });
		}

		writeFileSync(`${fullPath}/${filename}`, JSON.stringify(data, null, 4));
	}


	async getTvCreditsForPerson(id: number) {
		const data = await this.makeRequest(`${this.baseUrl}/person/${id}/tv_credits`, 'get');
		this.savetoCache(`/person/${id}/`, 'tv_credits.json', data);

		return data;
	}

	async getPersonDetails(id: number) {
		const data = await this.makeRequest(`${this.baseUrl}/person/${id}`, 'get');
		this.savetoCache(`/person/${id}/`, 'index.json', data);

		return data;
	}

	async getTvShowDetails(id: number) {
		const data = await this.makeRequest(`${this.baseUrl}/tv/${id}`, 'get');
		this.savetoCache(`/tv/${id}/`, 'index.json', data);

		return data;
	}

	async getTvShowCredits(id: number) {
		const data = await this.makeRequest(`${this.baseUrl}/tv/${id}/aggregate_credits`, 'get');
		this.savetoCache(`/tv/${id}/`, 'aggregate_credits.json', data);

		return data;
	}
}
