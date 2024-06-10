/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection UnnecessaryLocalVariableJS
import _ from 'lodash';
import chalk from 'chalk';
import { createWriteStream } from 'fs';
import { TmdbApi } from '../datasources/tmdb-api.ts';
import { db, logToFile, wait } from '../common.ts';
import { TvShow } from '../database/types.ts';
import { tmdbTvData } from '../datasources/tmdb-tv-utils.ts';
import { PersonMergedCredit, PersonMergedCredits, PersonRoleSummary } from '../datasources/types-person.ts';
import Case from 'case';

const api = new TmdbApi();
const logFile = createWriteStream('logs/populate-db.log');
const includedRoles = (await db.getRoles()).map(role => Case.snake(role.name));
const maxDegree = 3;

async function run() {
	await processTvShowsFromPerson(56323, 0);
}

async function processTvShowsFromPerson(personId: number, degree: number) {
	if (degree > maxDegree) {
		console.log(chalk.yellow(`Degree ${maxDegree} reached. Stopping.`));
		return;
	}

	// Get the person's TV credits, add them and their relevant credits to the database,
	// and return the IDs of the shows to look up for the next level of the tree.
	const showIdsToProcessNext: number[] = await getAndProcessTvCreditsForPerson(personId, degree);

	// Get the aggregate credits for each show, add the relevant ones to the database,
	// and return the IDs of the people to look up for the next level of the tree.
	const peopleIdsToProcessNext: number[] = _.uniq((await Promise.all(
			showIdsToProcessNext.map(getAndProcessTvShowAggregateCredits))
	).flat());

	// Recursively process the next level of the tree
	if (degree < maxDegree) { // Check degree before making recursive calls
		await Promise.all(peopleIdsToProcessNext.map(personId => processTvShowsFromPerson(personId, degree + 1)));
	}
}

/**
 * Look up a person's TV credits by their ID, add the relevant ones to the database,
 * and return the IDs of the shows to look up for the next level of the tree.
 * @param personId
 */
async function getAndProcessTvCreditsForPerson(personId: number, degree: number): Promise<number[]> {
	const showIdsToReturn: number[] = [];

	// Inner function to handle adding a person and show to the database once it's been determined that they should be included
	async function addPersonAndShowToDatabase({ personId, showId, showName }) {
		// Add the person to the database if they don't already exist,
		// (because if we update them here their Fey Number will be wrong)
		const person = await api.getPersonDetails(personId);
		const personExists = await db.getPerson(personId);
		if(!personExists) {
			await db.addOrUpdatePerson({
				id: personId,
				name: person.name,
				degree: degree
			});
		}

		// Add the show to the db
		await db.addOrUpdateTvShow({
			id: showId,
			name: showName
			// credit.episode_count is the person's episode count so not always appropriate to add here
			// it will be added along with other data when the show is looked up in getAndProcessTvShowAggregateCredits()
		});
	}

	// Inner function to wrap connectPersonToWork just to reduce repetition
	async function connect({ showId, roleName, roleEpisodeCount }) {
		const roleId: number = await db.getRoleId(Case.snake(roleName));
		if(roleId) {
			await db.connectPersonToWork(personId, showId, roleId, roleEpisodeCount);
		}
	}

	// All credits for the person, then filtered down to just the kind we're interested in
	const credits = await api.getTvCreditsForPerson(personId);
	const mergedCredits: PersonMergedCredits = tmdbTvData.filterFormatAndMergeCredits(credits);

	// Loop through each credit (which here, is a show
	// remembering that a person may have multiple roles within that show/credit, e.g., writer and director)
	for (const credit of mergedCredits.credits) {
		const showDetails = await api.getTvShowDetails(credit.id);

		// If the person had a cast role for at least 50% of the episodes, include it // TODO: Refine inclusion criteria
		if(credit.roles.some(role => role.type === 'cast' && role.episode_count / showDetails.number_of_episodes >= 0.5)) {
			await addPersonAndShowToDatabase({
				personId,
				showId: credit.id,
				showName: credit.name
			});

			// Connect the person to the show with the appropriate role ID(s) and role-based episode counts for all roles they had
			for (const role of credit.roles) {
				await connect({ showId: credit.id, roleName: role.name, roleEpisodeCount: role.episode_count });
			}

			// Add the show ID to the array that this function returns for further processing
			showIdsToReturn.push(credit.id);
		}
		// Otherwise, look at crew roles
		else {
			// This person and show are automatically included if they had any of the specified crew roles
			const autoIncludedRoles: PersonMergedCredit[] = mergedCredits.credits.filter(credit => {
				return credit.roles.filter(role => {
					return ['Creator', 'Executive Producer', 'Producer'].includes(role.name);
				});
			});
			// We also want to include other roles an auto-included person had in the same show,
			// but without processing the same role twice in terms of writing to the database
			const otherRoles = mergedCredits.credits.filter(credit => {
				return credit.roles.filter(role => {
					return !['Creator', 'Executive Producer', 'Producer'].includes(role.name);
				});
			});

			if (autoIncludedRoles.length > 0) {
				await addPersonAndShowToDatabase({
					personId,
					showId: credit.id,
					showName: credit.name
				});

				// Connect the person to the show with the appropriate role IDs for the auto-included roles
				for (const role of autoIncludedRoles) {
					// Some roles have their own episode count, but others such as Creator do not
					// and should inherit the show's episode count
					let episodeCountToUse = Number(role?.episode_count) ? role.episode_count : credit.episode_count;
					// If the episode count to use is still undefined, it's probably the Creator role which should use the show's total
					if (!episodeCountToUse) {
						episodeCountToUse = showDetails.number_of_episodes;
					}

					await connect({ showId: credit.id, roleName: role.name, roleEpisodeCount: role.episode_count });
				}

				// Add their other roles to the db
				for (const role of otherRoles) {
					await connect({ showId: credit.id, roleName: role.name, roleEpisodeCount: role.episode_count });
				}

				// Add the show ID to the array that this function returns for further processing
				showIdsToReturn.push(credit.id);
			}
			// This person did not have auto-included roles for this credit/show, but may have multiple that add up to qualify
			else {
				const showEpisodeCount = showDetails.number_of_episodes;
				const includeCredit = tmdbTvData.doesCumulativeCreditCount(credit, showEpisodeCount);
				if (includeCredit.inclusion) {
					// Add the person and the show to the database
					await addPersonAndShowToDatabase({
						personId,
						showId: credit.id,
						showName: credit.name
					});

					// Connect the person to the show with the appropriate role ID(s) and role-based episode counts
					for (const role of credit.roles) {
						await connect({ showId: credit.id, roleName: role.name, roleEpisodeCount: role.episode_count });
					}
				}
				if(includeCredit.continuation) {
					// Add the show to the array that this function returns for further processing
					showIdsToReturn.push(credit.id);
				}
			}
		}
	}

	return _.uniq(showIdsToReturn);
}


/**
 * Look up a TV show's aggregate credits, add the relevant ones to the database,
 * and return the IDs of the people to look up for the next level of the tree.
 * @param showId
 */
async function getAndProcessTvShowAggregateCredits(showId: number): Promise<number[]> {
	const peopleIds: number[] = [];
	const showDetails = await api.getTvShowDetails(showId);

	// Add the show to the db
	await db.addOrUpdateTvShow({
		id: showId,
		name: showDetails.name,
		start_year: Number(new Date(showDetails.first_air_date).getFullYear()),
		end_year: Number(new Date(showDetails.last_air_date).getFullYear()),
		episode_count: showDetails.number_of_episodes,
		season_count: showDetails.number_of_seasons,
	} as TvShow);

	// Include the creator in the returned IDs
	showDetails.created_by.forEach(creator => peopleIds.push(creator.id));

	const showCredits = await api.getTvShowCredits(showId);
	// Cast members who meet inclusion criteria
	const relevantCastIds = showCredits.cast
		.filter(credit => tmdbTvData.doesCumulativeCreditCount(credit, showDetails.number_of_episodes).inclusion)
		.map(credit => credit.id);

	// Crew members in included roles
	// Note: Because someone can have multiple roles, but the format of the aggregate credits isn't ideal for processing that,
	// their IDs are returned from here for processing but their inclusion gets decided based on cumulative episode count
	// in the processTvShowsFromPerson() function
	const crewIds = showCredits.crew.filter(credit => {
		return credit.jobs.some(job => includedRoles.includes(Case.snake(job.job)));
	}).map(credit => credit.id);

	peopleIds.push(...relevantCastIds, ...crewIds);

	return _.uniq(peopleIds);
}


run().then(() => {
	console.log(chalk.magenta('------------------------------------------------'));
	console.log(chalk.green('Database population complete.'));
	// TODO Add some stats here
	console.log(chalk.magenta('------------------------------------------------'));
	process.exit(0);
});
