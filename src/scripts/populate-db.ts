/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection UnnecessaryLocalVariableJS
import _ from 'lodash';
import { createWriteStream } from 'fs';
import { TmdbApi } from '../datasources/tmdb-api.ts';
import { db, customConsole, logToFile } from '../common.ts';
import { TvShow } from '../database/types.ts';
import { tmdbTvData } from '../datasources/tmdb-tv-utils.ts';
import { PersonMergedCredit, PersonMergedCredits, PersonRoleSummary } from '../datasources/types-person.ts';
import Case from 'case';
import async from 'async';

const api = new TmdbApi();
const logFile = createWriteStream('logs/populate-db.log');
const includedRoles = (await db.getRoles()).map(role => Case.snake(role.name));

class Populator {
	api = undefined;
	startPersonId: number;
	degree: number;
	maxDegree: number;
	// Keep a record of people who have already been added, so we can check more efficiently than querying the db
	peopleAlreadyAdded: Set<number>;
	// Likewise for shows, but remember shows should only be added here when a full show object has been added, not the minimal one
	showsAlreadyAdded: Set<number>;
	// Role IDs for easy lookup
	roleIds: { [key: string]: number };
	// Episode counts for easy lookup
	episodeCounts: { [key: string]: number };

	constructor(startPersonId: number) {
		this.api = new TmdbApi();
		this.startPersonId = startPersonId;
		this.degree = 0;
		this.maxDegree = 3;
		this.peopleAlreadyAdded = new Set<number>();
		this.showsAlreadyAdded = new Set<number>();
		this.roleIds = {};
		this.episodeCounts = {};

		// Bind methods to the class instance so that the above properties are available to them
		this.run = this.run.bind(this);
		this.getAndProcessTvCreditsForPerson = this.getAndProcessTvCreditsForPerson.bind(this);
		this.getAndProcessTvShowAggregateCredits = this.getAndProcessTvShowAggregateCredits.bind(this);
		this.addPersonAndShowToDatabase = this.addPersonAndShowToDatabase.bind(this);
		this.connect = this.connect.bind(this);
	}

	async run() {
		this.runMessageQueue();

		const showsInDb = await db.getAllTvShows();
		showsInDb.forEach(show => this.showsAlreadyAdded.add(show.id));
		const peopleInDb = await db.getAllPeople();
		peopleInDb.forEach(person => this.peopleAlreadyAdded.add(person.id));
		customConsole.info(`Database already contained ${showsInDb.length} shows and ${peopleInDb.length} people.`, true);

		let peopleIdsToProcessNext = [this.startPersonId];
		let peopleProcessedCount = 0;

		while(this.degree <= this.maxDegree) {
			if(this.degree === this.maxDegree) {
				customConsole.warn('Max degree reached, stopping.', true);
				return true;
			}

			customConsole.announce(`${peopleIdsToProcessNext.length} people to process at degree ${this.degree}`, true);

			// Sequentially process the TV credits for each person at the current degree
			// Doing things synchronously helps reduce duplicate requests and makes it easier to track progress and debug issues
			const showIds: number[][] = await async.mapSeries(peopleIdsToProcessNext, (async (personId: number) => {
				try {
					const result = await this.getAndProcessTvCreditsForPerson(personId, this.degree);
					customConsole.success(`Processed ${peopleProcessedCount + 1} of ${peopleIdsToProcessNext.length} at degree ${this.degree}\t (Person ID ${personId})\t Show IDs returned: ${result}`, true);
					peopleProcessedCount++;
					return result;
				}
                catch (error) {
					customConsole.error(`Error processing person ID ${personId}:\t ${error}`, true);
					logToFile(logFile, `Error processing person ID ${personId}:\t ${error}`);
					return [];
				}
			}));
			const showIdsToProcessNext: number[] = _.difference(_.uniq(showIds.flat()), Array.from(this.showsAlreadyAdded));
			customConsole.announce(
				`${showIdsToProcessNext.length} shows to process at degree ${this.degree}.`, true
			);

			// Only if we have not reached the max degree, do further processing of the shows and get the next round of people
			// TODO: This means that the last batch of shows will have minimal data, because most show fields are populated in
			//  getAndProcessTvShowAggregateCredits, which we do not want to run again - we just want the show details query part.
			if(this.degree < this.maxDegree) {
				const peopleIds = await async.mapSeries(showIdsToProcessNext, (async (showId: number) => {
					const result = await this.getAndProcessTvShowAggregateCredits(showId);
					customConsole.success(`Processed show ID ${showId}.\t People IDs returned: ${result}`, true);
					return result;
				}));
				peopleIdsToProcessNext = _.difference(_.uniq(peopleIds.flat()), Array.from(this.peopleAlreadyAdded));

				this.degree++;
			}
		}
	}


	// Ensure processQueue runs continuously in the background
	// NOTE: Using this custom logging means console messages are often far behind the actual processing status.
	runMessageQueue() {
		if(!customConsole.verbose) {
			customConsole.warn('Important warning: This custom console logging is designed for a human watching it, ' +
				'with artificial delays to make it readable. This means it runs far behind the actual processing status.' +
				'\nFor a more accurate view of the process, set `verbose` to true in the runMessageQueue() call.' +
				'\nThis will log directly to the console without delays, and ignores persistent/transient message status.', true);
		}
		else {
			customConsole.warn('Running console logging in verbose mode.' +
				'\nLogging will be instant and persistent/transient message status will be ignored.', true);
		}

		setInterval(() => {
			if (!customConsole.isProcessing && customConsole.messageQueue.length > 0) {
				customConsole.processQueue();
			}
		}, 100);
	}


	/**
	 * Look up a person's TV credits by their ID, add the relevant ones to the database,
	 * and return the IDs of the shows to look up for the next level of the tree.
	 * @param personId
	 * @param degree
	 *
	 * @return {Promise<number[]>} An array of show IDs to look up next
	 */
	async getAndProcessTvCreditsForPerson(personId: number, degree: number): Promise<number[]> {
		if(this.peopleAlreadyAdded.has(personId)) {
			customConsole.warn(`Person ID ${personId} has already been processed, skipping.`, true);
			return;
		}

		const showIdsToReturn: number[] = [];

		// All credits for the person, then filtered down to just the kind we're interested in
		const credits = await api.getTvCreditsForPerson(personId);
		if(!credits) {
			customConsole.warn(`Failed to fetch credits for person ID ${personId}, skipping.`, true);
			return;
		}

		const mergedCredits: PersonMergedCredits = tmdbTvData.filterFormatAndMergeCredits(credits);

		// Loop through each credit (which here, is a show)
		// remembering that a person may have multiple roles within that show/credit, e.g., writer and director
		await async.eachSeries(mergedCredits.credits, async (credit: PersonMergedCredit) => {
			let cachedEpisodeCount = this.episodeCounts?.[credit.id];
			if (!cachedEpisodeCount) {
				const showDetails = await api.getTvShowDetails(credit.id);
				if (showDetails && showDetails.number_of_episodes) {
					this.episodeCounts[credit.id.toString()] = showDetails.number_of_episodes;
					cachedEpisodeCount = showDetails.number_of_episodes;
				}
			}

			// If the person had a cast role for at least 50% of the episodes, include it
			// TODO: Refine inclusion criteria and use/add to the tmbdTVData functions for this
			if (credit.roles.some(role => role.type === 'cast' && role.episode_count / cachedEpisodeCount >= 0.5)) {
				await this.addPersonAndShowToDatabase({
					personId,
					degree: degree,
					showId: credit.id,
					showName: credit.name
				});

				// Connect the person to the show with the appropriate role ID(s) and role-based episode counts for all roles they had
				await async.eachSeries(credit.roles, async (role) => {
					await this.connect({
						personId: personId,
						showId: credit.id,
						roleName: role.name,
						roleEpisodeCount: role.episode_count
					});
				});

				// Add the show ID to the array that this function returns for further processing
				showIdsToReturn.push(credit.id);
			}
			// Otherwise, look at crew roles
			else {
				// This person and show are automatically included if they had any of the specified crew roles
				const autoIncludedRoles: PersonRoleSummary[] = credit.roles.filter(role => {
					return ['Creator', 'Executive Producer', 'Producer'].includes(role.name);
				});
				// We also want to include other roles an auto-included person had in the same show,
				// but without processing the same role twice in terms of writing to the database
				const otherRoles: PersonRoleSummary[] = _.omit(credit.roles, autoIncludedRoles.map(role => role.name));

				if (autoIncludedRoles.length > 0) {
					await this.addPersonAndShowToDatabase({
						personId,
						degree: degree,
						showId: credit.id,
						showName: credit.name
					});

					// Connect the person to the show with the appropriate role IDs for the auto-included roles
					await async.eachSeries(autoIncludedRoles, async (role) => {
						// Some roles have their own episode count, but others such as Creator do not
						// and should inherit the show's episode count
						let episodeCountToUse = Number(role?.episode_count) ? role.episode_count : credit.episode_count;
						// If the episode count to use is still undefined, it's probably the Creator role which should use the show's total
						if (!episodeCountToUse) {
							episodeCountToUse = cachedEpisodeCount;
						}

						await this.connect({
							personId: personId,
							showId: credit.id,
							roleName: role.name,
							roleEpisodeCount: episodeCountToUse
						});
					});

					// Add their other roles to the db
					if(otherRoles.length > 0) {
						await async.eachSeries(otherRoles, async (role) => {
							await this.connect({
								personId: personId,
								showId: credit.id,
								roleName: role.name,
								roleEpisodeCount: role.episode_count
							});
						});
					}

					// Add the show ID to the array that this function returns for further processing
					showIdsToReturn.push(credit.id);
				}
				// This person did not have auto-included roles for this credit/show, but may have multiple that add up to qualify
				else {
					const countFor = tmdbTvData.doesCumulativeCreditCount(credit, cachedEpisodeCount);

					if (countFor.inclusion) {
						// Add the person and the show to the database
						await this.addPersonAndShowToDatabase({
							personId,
							degree: degree,
							showId: credit.id,
							showName: credit.name
						});

						// Connect the person to the show with the appropriate role ID(s) and role-based episode counts
						for (const role of credit.roles) {
							await this.connect({
								personId: personId,
								showId: credit.id,
								roleName: role.name,
								roleEpisodeCount: role.episode_count
							});
						}
					}
					if (countFor.continuation) {
						// Add the show to the array that this function returns for further processing
						showIdsToReturn.push(credit.id);
					}
				}
			}
		});

		return showIdsToReturn;
	}


	/**
	 * Look up a TV show's aggregate credits, add the relevant ones to the database,
	 * and return the IDs of the people to look up for the next level of the tree.
	 * @param showId
	 *
	 * @return {Promise<number[]>} An array of person IDs to look up next
	 */
	async getAndProcessTvShowAggregateCredits(showId: number): Promise<number[]> {
		if(this.showsAlreadyAdded.has(showId)) {
			customConsole.warn(`Show ID ${showId} has already been processed, skipping.`, true);
			return;
		}

		const peopleIdsToReturn: number[] = [];

		// Fetch and handle show details
		const showDetails = await api.getTvShowDetails(showId);
		if(showDetails) {
			// Add the show to the db
			await db.addOrUpdateTvShow({
				id: showId,
				name: showDetails.name,
				start_year: Number(new Date(showDetails.first_air_date).getFullYear()),
				end_year: Number(new Date(showDetails.last_air_date).getFullYear()),
				episode_count: showDetails.number_of_episodes,
				season_count: showDetails.number_of_seasons,
			} as TvShow);

			// Record that this show has been added and save episode count for quick lookups in later iterations
			this.showsAlreadyAdded.add(showId);
			this.episodeCounts[showId?.toString()] = showDetails?.number_of_episodes;

			// Include the creator in the returned IDs
			showDetails.created_by.forEach(creator => peopleIdsToReturn.push(creator.id));
		}

		// Fetch and handle aggregate credits
		const showCredits = await api.getTvShowCredits(showId);
		const episodeCount = this.episodeCounts[showId?.toString()] || showDetails?.number_of_episodes;
		if(showCredits && episodeCount) {
			// Cast members who meet inclusion criteria
			const relevantCastIds = showCredits.cast
				.filter(credit => tmdbTvData.doesCumulativeCreditCount(credit, episodeCount).inclusion)
				.map(credit => credit.id);

			// Crew members in included roles
			// Note: Because someone can have multiple roles, but the format of the aggregate credits isn't ideal for processing that,
			// their IDs are returned from here for processing but their inclusion gets decided based on cumulative episode count
			// in the processTvShowsFromPerson() function
			const crewIds = showCredits.crew.filter(credit => {
				return credit.jobs.some(job => includedRoles.includes(Case.snake(job.job)));
			}).map(credit => credit.id);

			peopleIdsToReturn.push(...relevantCastIds, ...crewIds);
		}

		if(!showDetails || !showCredits) {
			customConsole.error(`Failed to fetch some data for show ID ${showId}, which may have impacted cast and crew inclusion.`, true);
			logToFile(logFile, `Failed to fetch some data for show ID ${showId}, which may have impacted cast and crew inclusion.`);
		}

		return _.difference(_.uniq(peopleIdsToReturn), Array.from(this.peopleAlreadyAdded)) || [];
	}


	/**
	 * Utility function to handle adding a person and show to the database once it's been determined that they should be included
	 * @param personId
	 * @param degree
	 * @param showId
	 * @param showName
	 *
	 * @return {Promise<void>}
	 */
	async addPersonAndShowToDatabase({ personId, degree, showId, showName }): Promise<void> {
		// Add the person to the database if they don't already exist (because if we update them here their degree will be wrong)
		if(!this.peopleAlreadyAdded.has(personId)) { // they were not added in this session
			const personExists = await db.getPerson(personId); // ...and they also didn't already exist in the db
			if (!personExists) {
				const person = await api.getPersonDetails(personId);
				await db.addOrUpdatePerson({
					id: personId,
					name: person?.name ?? '',
					degree: degree
				});

				// Record that is person has been added, so we don't add them again in this run
				this.peopleAlreadyAdded.add(personId);
			}
		}

		if(!this.showsAlreadyAdded.has(showId)) {
			// Add the show to the db if we haven't already
			// but don't add it to the array of shows that have been added, because it's not a full show object yet
			await db.addOrUpdateTvShow({
				id: showId,
				name: showName
				// credit.episode_count is the person's episode count so not always appropriate to add here
				// it will be added along with other data when the show is looked up in getAndProcessTvShowAggregateCredits()
			});
		}
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


new Populator(56323).run().then(() => {
	customConsole.success('Database population complete.', true);
	// TODO Make sure message queue has finished before exiting
	//process.exit(0);
});
