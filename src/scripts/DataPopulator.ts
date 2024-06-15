import { TmdbApi } from '../datasources/tmdb-api.ts';
import { createWriteStream, WriteStream } from 'fs';
import { customConsole, db } from '../common.ts';
import Case from 'case';

// Fields/methods that must be implemented by child classes
export interface DataPopulatorInterface {
	run(): void;
}

// Parent class for script classes that populate the database
export class DataPopulator {
	api = undefined;
	logFile: WriteStream;
	roleIds: { [key: string]: number };

	constructor() {
		this.api = new TmdbApi();
		this.logFile = createWriteStream('logs/populate-db.log');
		// Role IDs for easy lookup
		this.roleIds = {};
	}


	/**
	 * Ensure custom console logger's processQueue runs continuously in the background
	 * NOTE: Using this custom logging in non-verbose mode means console messages are often far behind the actual processing status.
	 */
	runMessageQueue() {
		if(!customConsole.verbose) {
			customConsole.warn('\nImportant warning: This custom console logging is designed for a human watching it, ' +
				'with artificial delays to make it readable. This means it runs far behind the actual processing status.' +
				'\nFor a more accurate view of the process, set `verbose` to true in the runMessageQueue() call.' +
				'\nThis will log directly to the console without delays, and ignores persistent/transient message status.', true);
		}
		else {
			customConsole.warn('\nRunning console logging in verbose mode.' +
				'\nLogging will be instant and persistent/transient message status will be ignored.', true);
		}

		setInterval(async () => {
			if (!customConsole.isProcessing && customConsole.messageQueue.length > 0) {
				await customConsole.processQueue();
			}
		}, 100);
	}


	/**
	 * Utility function to wrap connectPersonToWork just to reduce repetition
	 * @param personId
	 * @param showId
	 * @param roleName
	 * @param roleEpisodeCount
	 *
	 * @return {Promise<void>}
	 */
	async connect({ personId, showId, roleName, roleEpisodeCount }): Promise<void> {
		// Use locally stored role ID if we have it, otherwise fetch from the db
		const roleId: number = this.roleIds[roleName] || await db.getRoleId(Case.snake(roleName));
		if(roleId) {
			await db.connectPersonToWork(personId, showId, roleId, roleEpisodeCount);
			// Add the role to the local store for future lookups
			this.roleIds[roleName] = roleId;
		}
	}
}
