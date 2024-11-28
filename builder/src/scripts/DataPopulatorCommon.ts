import { createWriteStream, WriteStream } from 'fs';
import { TmdbApi } from '../datasources/tmdb-api.ts';
import { PopulationScriptSettings } from './types.ts';

/**
 * Top-level parent class for all data population script classes.
 */
export class DataPopulatorCommon {
	api: TmdbApi;
	logFile: WriteStream;
	startPersonId: number;

	constructor({ startPersonId, useCached }: PopulationScriptSettings) {
		this.api = new TmdbApi({ defaultUseCached: useCached });
		this.logFile = createWriteStream('logs/populate-db.log');
		this.startPersonId = startPersonId;

		// Bind methods to the class instance so the properties above are available to them
		this.setup = this.setup.bind(this);
	}

	async setup() {
	}
}
