import { DataPopulator, DataPopulatorInterface } from './DataPopulator.ts';
import { db, customConsole, logToFile } from '../common.ts';
import { TvShow } from '../database/types.ts';
import { tmdbTvData } from '../datasources/tmdb-tv-utils.ts';
import {
	PersonMergedCredit,
	PersonMergedCredits,
	PersonRoleSummary, PersonTVRoleSummary
} from '../datasources/types-person.ts';
import { PopulationScriptSettings } from './types.ts';
import _ from 'lodash';
import Case from 'case';
import async from 'async';


class TVPopulator extends DataPopulator implements DataPopulatorInterface {
	cachedEpisodeCounts: { [key: string]: number };
	RUN_TYPE = 'tv_shows';

	constructor(settings: PopulationScriptSettings) {
		super(settings);
		this.cachedEpisodeCounts = {};

		// Bind methods to the class instance so that the above properties are available to them
		this.getAndProcessCreditsForPerson = this.getAndProcessCreditsForPerson.bind(this);
		this.getAndProcessCreditsForWork = this.getAndProcessCreditsForWork.bind(this);
		this.addPersonAndWorkToDatabase = this.addPersonAndWorkToDatabase.bind(this);
	}

	async run() {
		const showsInDb = await db.getAllTvShows();
		showsInDb.length > 0 && showsInDb.forEach(show => this.worksAlreadyAdded.add(show.id));

		await super.run(this.RUN_TYPE);
	}


	/**
	 * Look up a person's TV credits by their ID, add the relevant ones to the database,
	 * and return the IDs of the shows to look up for the next level of the tree.
	 * @param personId
	 * @param degree
	 *
	 * @return {Promise<number[]>} An array of show IDs to look up next
	 */
	async getAndProcessCreditsForPerson(personId: number, degree: number): Promise<number[]> {
		if(this.peopleAlreadyAdded?.[this.RUN_TYPE]?.has(personId)) {
			customConsole.warn(`Person ID ${personId} has already been processed, skipping.`, true);
			return [];
		}

		const showIdsToReturn: number[] = [];

		// All credits for the person, then filtered down to just the kind we're interested in
		const credits = await this.api.getTvCreditsForPerson(personId);
		if(!credits) {
			customConsole.warn(`Failed to fetch credits for person ID ${personId}, skipping.`, true);
			return [];
		}

		const mergedCredits: PersonMergedCredits = tmdbTvData.filterFormatAndMergeCredits(credits);

		// Loop through each credit (which here, is a show)
		// remembering that a person may have multiple roles within that show/credit, e.g., writer and director
		await async.eachSeries(mergedCredits.credits, async (credit: PersonMergedCredit) => {
			let cachedEpisodeCount = this.cachedEpisodeCounts?.[credit.id];
			if (!cachedEpisodeCount) {
				const showDetails = await this.api.getTvShowDetails(credit.id);
				if (showDetails && showDetails.number_of_episodes) {
					this.cachedEpisodeCounts[credit.id.toString()] = showDetails.number_of_episodes;
					cachedEpisodeCount = showDetails.number_of_episodes;
				}
			}

			// If the person had a cast role for at least 50% of the episodes, include it
			// TODO: Refine inclusion criteria and use/add to the tmbdTVData functions for this
			// eslint-disable-next-line max-len
			if (credit.roles.some((role: PersonTVRoleSummary) => role.type === 'cast' && role.episode_count && (role?.episode_count / cachedEpisodeCount >= 0.5))) {
				await this.addPersonAndWorkToDatabase({
					personId,
					degree: degree,
					workId: credit.id,
					workName: credit.name
				});

				// Connect the person to the show with the appropriate role ID(s) and role-based episode counts for all roles they had
				await async.eachSeries(credit.roles, async (role: PersonTVRoleSummary) => {
					await this.connect({
						personId: personId,
						workId: credit.id,
						roleName: role.type === 'cast' ? 'cast' : role.name,
						count: role?.episode_count
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
					await this.addPersonAndWorkToDatabase({
						personId,
						degree: degree,
						workId: credit.id,
						workName: credit.name
					});

					// Connect the person to the show with the appropriate role IDs for the auto-included roles
					await async.eachSeries(autoIncludedRoles, async (role: PersonTVRoleSummary) => {
						// Some roles have their own episode count, but others such as Creator do not
						// and should inherit the show's episode count
						let episodeCountToUse = Number(role?.episode_count) && role.episode_count;
						// If the episode count to use is still undefined, it's probably the Creator role which should use the show's total
						if (!episodeCountToUse) {
							episodeCountToUse = cachedEpisodeCount;
						}

						await this.connect({
							personId: personId,
							workId: credit.id,
							roleName: role.type === 'cast' ? 'cast' : role.name,
							count: episodeCountToUse
						});
					});

					// Add their other roles to the db
					if(otherRoles.length > 0) {
						await async.eachSeries(otherRoles, async (role: PersonTVRoleSummary) => {
							await this.connect({
								personId: personId,
								workId: credit.id,
								roleName: role.type === 'cast' ? 'cast' : role.name,
								count: role.episode_count
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
						await this.addPersonAndWorkToDatabase({
							personId,
							degree: degree,
							workId: credit.id,
							workName: credit.name
						});

						// Connect the person to the show with the appropriate role ID(s) and role-based episode counts
						for (const role of credit.roles) {
							await this.connect({
								personId: personId,
								workId: credit.id,
								roleName: role.type === 'cast' ? 'cast' : role.name,
								count: (role as PersonTVRoleSummary)?.episode_count
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
	async getAndProcessCreditsForWork(showId: number): Promise<number[]> {
		const peopleIdsToReturn: number[] = [];
		if(this.worksAlreadyAdded.has(showId)) {
			customConsole.warn(`Show ID ${showId} has already been processed, skipping.`, true);
			return [];
		}

		// Fetch and handle show details
		const showDetails = await this.api.getTvShowDetails(showId);
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
			this.worksAlreadyAdded.add(showId);
			this.cachedEpisodeCounts[showId?.toString()] = showDetails?.number_of_episodes;

			// Include the creator in the returned IDs
			showDetails.created_by.forEach((creator: { id: number; }) => peopleIdsToReturn.push(creator.id));
		}

		// Fetch and handle aggregate credits
		const showCredits = await this.api.getTvShowCredits(showId);
		const episodeCount = this.cachedEpisodeCounts[showId?.toString()] || showDetails?.number_of_episodes;
		if(showCredits && episodeCount) {
			// Cast members who meet inclusion criteria
			const relevantCastIds = showCredits.cast
				.filter((credit: PersonMergedCredit) => tmdbTvData.doesCumulativeCreditCount(credit, episodeCount).inclusion)
				.map((credit: PersonMergedCredit) => credit.id);

			// Crew members in included roles
			// Note: Because someone can have multiple roles, but the format of the aggregate credits isn't ideal for processing that,
			// their IDs are returned from here for processing but their inclusion gets decided based on cumulative episode count
			// in the getAndProcessCreditsForPerson function
			const crewIds = showCredits.crew.filter((credit) => {
				return credit.jobs.some(job => this.includedRoles.includes(Case.snake(job.job)));
			}).map(credit => credit.id);

			peopleIdsToReturn.push(...relevantCastIds, ...crewIds);
		}

		if(!showDetails || !showCredits) {
			customConsole.error(`Failed to fetch some data for show ID ${showId}, which may have impacted cast and crew inclusion.`, true);
			logToFile(this.logFile, `Failed to fetch some data for show ID ${showId}, which may have impacted cast and crew inclusion.`);
		}

		return _.uniq(peopleIdsToReturn);
	}


	/**
	 * Utility function to handle adding a person and show to the database once it's been determined that they should be included
	 * NOTE: This assumes TV show population is done from degree 0 and before movie population, so degree should not change.
	 * @param personId
	 * @param degree
	 * @param workId
	 * @param workName
	 *
	 * @return {Promise<void>}
	 */
	async addPersonAndWorkToDatabase({ personId, degree, workId, workName }): Promise<void> {
		// Add the person to the database if they don't already exist (because if we update them here their degree will be wrong)
		if(!this.peopleAlreadyAdded?.[this.RUN_TYPE]?.has(personId)) { // they were not added in this session
			const personExists = await db.getPerson(personId); // ...and they also didn't already exist in the db
			if (!personExists) {
				const person = await this.api.getPersonDetails(personId);
				await db.addOrUpdatePerson({
					id: personId,
					name: person?.name ?? '',
					degree: degree
				});

				// Record that is person has been added, so we don't add them again in this run
				this.peopleAlreadyAdded[this.RUN_TYPE].add(personId);
			}
		}

		if(!this.worksAlreadyAdded?.has(workId)) {
			// Add the show to the db if we haven't already
			// but don't add it to the array of shows that have been added, because it's not a full show object yet
			await db.addOrUpdateTvShow({
				id: workId,
				name: workName
				// credit.episode_count is the person's episode count so not always appropriate to add here
				// it will be added along with other data when the show is looked up in getAndProcessCreditsForWork()
			});
		}
	}
}


export function populateDbTv({ startPersonId, maxDegree }: PopulationScriptSettings) {
	new TVPopulator({ startPersonId, maxDegree }).run().then(() => {
		customConsole.stopAllProgressBars();
		customConsole.logProgress('TV show population complete.');
		customConsole.success('Initial TV show population complete.', true);
	});
}
