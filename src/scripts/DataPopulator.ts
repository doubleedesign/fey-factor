/* eslint-disable @typescript-eslint/no-unused-vars */
import { customConsole, db, logToFile } from '../common.ts';
import Case from 'case';
import { PopulationScriptSettings } from './types.ts';
import async from 'async';
import _ from 'lodash';
import { DataPopulatorCommon } from './DataPopulatorCommon.ts';

// Fields/methods that must be implemented by child classes
export interface DataPopulatorInterface {
	run(): void;
	getAndProcessCreditsForPerson(personId: number, degree: number): Promise<number[]>;
	getAndProcessCreditsForWork(workId: number): Promise<number[]>;
	addPersonAndWorkToDatabase({ personId, degree, workId, workName }): Promise<void>;
}


/**
 * Second-level parent class for data population script classes that do initial data population
 * (as opposed to gap-filling or data top-up operations).
 */
export class DataPopulator extends DataPopulatorCommon implements DataPopulatorInterface {
	degree: number;
	maxDegree: number;
	roleIds: { [key: string]: number };
	includedRoles: string[]; // Roles that are set in the database
	// Keep a record of what's already been added, so we can check more efficiently than querying the db
	worksAlreadyAdded: Set<number>;
	peopleAlreadyAdded: Set<number>;

	constructor(settings: PopulationScriptSettings) {
		super(settings);
		this.roleIds = {}; // Role IDs for easy lookup. includedRoles can't be set here because it's async, so it's set in setup()
		this.worksAlreadyAdded = new Set<number>();
		this.peopleAlreadyAdded = new Set<number>();
		this.degree = 0;
		this.maxDegree = settings.maxDegree;

		// Bind methods to the class instance so the properties above are available to them
		this.setup = this.setup.bind(this);
		this.run = this.run.bind(this);
		this.connect = this.connect.bind(this);
	}

	async setup() {
		await super.setup();

		this.includedRoles = (await db.getRoles()).map(role => Case.snake(role.name));
		const peopleInDb = await db.getAllPeople();
		peopleInDb.forEach(person => this.peopleAlreadyAdded.add(person.id));
		// worksAlreadyAdded is populated by the child classes
	}

	async run() {
		await this.setup();

		let peopleIdsToProcessNext = [this.startPersonId];
		let peopleProcessedCount = 0;

		while(this.degree < this.maxDegree + 1) {
			customConsole.announce(`${peopleIdsToProcessNext.length} people to process at degree ${this.degree}`, true);

			// Sequentially process the credits for each person at the current degree
			// Doing things synchronously helps reduce duplicate requests and makes it easier to track progress and debug issues
			const workIds: number[][] = await async.mapSeries(peopleIdsToProcessNext, (async (personId: number) => {
				try {
					const result = await this.getAndProcessCreditsForPerson(personId, this.degree);
					// eslint-disable-next-line max-len
					customConsole.success(`Processed ${peopleProcessedCount + 1} of ${peopleIdsToProcessNext.length} at degree ${this.degree}\t (Person ID ${personId})\t Work IDs returned: ${result}`, true);
					peopleProcessedCount++;
					return result;
				}
				catch (error) {
					customConsole.error(`Error processing person ID ${personId}:\t ${error}`, true);
					logToFile(this.logFile, `Error processing person ID ${personId}:\t ${error}`);
					return [];
				}
			}));
			const workIdsToProcessNext: number[] = _.difference(_.uniq(workIds.flat()), Array.from(this.worksAlreadyAdded));

			customConsole.announce(
				`${workIdsToProcessNext.length} shows to process at degree ${this.degree}.`, true
			);

			const peopleIds = await async.mapSeries(workIdsToProcessNext, (async (showId: number) => {
				const result = await this.getAndProcessCreditsForWork(showId);
				customConsole.success(`Processed work ID ${showId}.\t Number of People IDs returned: ${result.length}`, true);
				return result;
			}));
			peopleIdsToProcessNext = _.difference(_.uniq(peopleIds.flat()), Array.from(this.peopleAlreadyAdded));

			this.degree++;
		}
	}


	getAndProcessCreditsForPerson(personId: number, degree: number): Promise<number[]> {
		throw new Error('Method not implemented: getAndProcessCreditsForPerson. ' +
			'This must be implemented by the child class you\'re using.');
	}

	getAndProcessCreditsForWork(workId: number): Promise<number[]> {
		throw new Error('Method not implemented: getAndProcessCreditsForWork. ' +
			'This must be implemented by the child class you\'re using.');
	}

	addPersonAndWorkToDatabase({ personId, degree, workId, workName }): Promise<void> {
		throw new Error('Method not implemented: addPersonAndWorkToDatabase. ' +
			'This must be implemented by the child class you\'re using.');
	}


	/**
	 * Utility function to wrap connectPersonToWork just to reduce repetition
	 * @param personId
	 * @param showId
	 * @param roleName
	 * @param count - episode count for TV shows; should be null for movies
	 *
	 * @return {Promise<void>}
	 */
	async connect({ personId, workId, roleName, count }): Promise<void> {
		// Use locally stored role ID if we have it, otherwise fetch from the db
		const roleId: number = this.roleIds[roleName] || await db.getRoleId(Case.snake(roleName));
		if(roleId) {
			await db.connectPersonToWork(personId, workId, roleId, count);
			// Add the role to the local store for future lookups
			this.roleIds[roleName] = roleId;
		}
	}
}
