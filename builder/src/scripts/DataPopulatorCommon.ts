import { createWriteStream, WriteStream } from 'fs';
import { TmdbApi } from '../datasources/tmdb-api.ts';
import { PopulationScriptSettings } from './types.ts';
import { customConsole } from '../common.ts';

/**
 * Top-level parent class for all data population script classes.
 */
export class DataPopulatorCommon {
	api: TmdbApi;
	logFile: WriteStream;
	startPersonId: number;

	constructor({ startPersonId }: PopulationScriptSettings) {
		this.api = new TmdbApi();
		this.logFile = createWriteStream('logs/populate-db.log');
		this.startPersonId = startPersonId;

		// Bind methods to the class instance so the properties above are available to them
		this.setup = this.setup.bind(this);
		this.runMessageQueue = this.runMessageQueue.bind(this);
	}

	async setup() {
		this.runMessageQueue();
	}

	/**
	 * Ensure custom console logger's processQueue runs continuously in the background
	 * NOTE: Using this custom logging in non-verbose mode means console messages are often far behind the actual processing status.
	 */
	runMessageQueue() {
		if(customConsole.style === 'pretty') {
			customConsole.warn('\nImportant warning: This custom console logging is designed for a human watching it, ' +
				'with artificial delays to make it readable. This means it runs far behind the actual processing status.' +
				'\nFor a more accurate view of the process, set `verbose` to true in the runMessageQueue() call.' +
				'\nThis will log directly to the console without delays, and ignores persistent/transient message status.', true);
		}
		else if(customConsole.style === 'verbose') {
			customConsole.warn('\nRunning console logging in verbose mode.' +
				'\nLogging will be instant and persistent/transient message status will be ignored.', true);
		}
		else if(customConsole.style === 'progress') {
			customConsole.warn('\nRunning console logging in progress mode.' +
				'\nOnly progress bars will be displayed, and all other messages will be ignored.', true);
		}

		setInterval(async () => {
			if (!customConsole.isProcessing && customConsole.messageQueue.length > 0) {
				await customConsole.processQueue();
			}
		}, 100);
	}
}
