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

let degrees = 0;
while(degrees <= 3) {
	await processTvShowsFromPerson(56323);
}

async function processTvShowsFromPerson(personId: number) {
	const person = await api.getPersonDetails(personId);
	await db.addOrUpdatePerson({
		id: personId,
		name: person.name,
		feyNumber: degrees
	});

	// Get the person's TV credits, add the relevant ones to the database,
	// and return the IDs of the shows to look up for the next level of the tree.
	const showIdsToProcessNext: number[] = await getAndProcessTvCreditsForPerson(personId);

	// Get the aggregate credits for each show, add the relevant ones to the database,
	// and return the IDs of the people to look up for the next level of the tree.
	const peopleIdsToProcessNext: number[] = _.uniq((await Promise.all(
		showIdsToProcessNext.map(getAndProcessTvShowAggregateCredits))
	).flat());

	// Increment the degree of separation
	degrees++;

	// Recursively process the next level of the tree
	peopleIdsToProcessNext.forEach(processTvShowsFromPerson);
}

/**
 * Look up a person's TV credits by their ID, add the relevant ones to the database,
 * and return the IDs of the shows to look up for the next level of the tree.
 * // TODO: Finish this
 * @param personId
 */
async function getAndProcessTvCreditsForPerson(personId: number): Promise<number[]> {
	await wait(2000);
	const credits = await api.getTvCreditsForPerson(personId);
	const mergedCredits = tmdbTvData.filterFormatAndMergeCredits(credits);
	let showDetails;

	// Each "credit" here is a show the person has been involved in.
	// They are returned from the filter if they are to be included in the next step of processing,
	// but also may be actioned here even if they are not included in the next step.
	// e.g., notable guest roles are included for the person, but we don't keep the tree going from there.
	const includedCreditsForContinuation: PersonMergedCredit[] = mergedCredits.credits.filter(async (credit: PersonMergedCredit) => {
		// Some roles are automatically included, no need to query the API for show details
		const autoIncludedRoles: PersonRoleSummary[] = credit.roles.filter(role => {
			return ['Creator', 'Executive Producer', 'Producer'].includes(role.name);
		});
		if (autoIncludedRoles.length > 0) {
			// Add the show to the db
			await db.addOrUpdateTvShow({
				id: credit.id,
				name: credit.name,
				// credit.episode_count is the person's episode count so not always appropriate to add here
				// it will be added along with other data when the show is looked up in getAndProcessTvShowAggregateCredits()
			});
			for (const role of autoIncludedRoles) {
				const roleId: number = await db.getRoleId(Case.snake(role.name));
				if(roleId) {
					// Some roles have their own episode count, but others such as Creator do not
					// and should inherit the show's episode count
					let episodeCountToUse = Number(role?.episode_count) ? role.episode_count : credit.episode_count;
					// If the episode count to use is still undefined, it's probably the Creator role which should use the show's total
					if(!episodeCountToUse) {
						showDetails = await api.getTvShowDetails(credit.id);
						episodeCountToUse = showDetails.number_of_episodes;
					}
					await db.connectPersonToWork(personId, credit.id, roleId, episodeCountToUse);
				}
				else {
					console.error(chalk.red(`Role ID not found for ${role.name}`));
				}
			}

			return true;
		}

		if (!showDetails) {
			showDetails = await api.getTvShowDetails(credit.id);
		}
		const showEpisodeCount = showDetails.number_of_episodes;

		//
		// // Include main cast and recurring roles above the threshold
		// const castCredit = credit.roles.find(role => role.type === 'cast');
		// const doesItCount = tmdbTvData.doesCastOrCumulativeCreditCount(castCredit, showEpisodeCount);
		// if(doesItCount.includePerson) {
		// 	await db.addPerson({ id: personId, name: credit.name, feyNumber });
		// 	await db.connectPersonToWork(personId, credit.id, castRoleId, castCredit.episode_count);
		// 	// Not returning false here in case this person had other roles that would mean this credit gets included for further processing
		// }
		// if(doesItCount.continueTree) {
		// 	// Shouldn't need to add to the db here because if continueTree is true, includePerson should have been too
		// 	return true;
		// }
		//
		// // Add up the episode counts of all roles
		// // Note: This means someone who has more than one job in a single episode is counted twice. This is intentional.
		// const cumulativeEpisodeCount = credit.roles.reduce((acc, role) => acc + role.episode_count, 0);
		// const doesItCountNow = tmdbTvData.doesCastOrCumulativeCreditCount(
		// 	{ name: credit.name, episode_count: cumulativeEpisodeCount }, showEpisodeCount
		// );
		// if(doesItCountNow.includePerson) {
		// 	await db.addPerson({ id: personId, name: credit.name, feyNumber });
		// 	for (const role of credit.roles) {
		// 		const roleId: number = await db.getRoleId(Case.snake(role.name));
		// 		await db.connectPersonToWork(personId, credit.id, roleId, credit.roles[0].episode_count);
		// 	}
		// 	// Not returning false here in case this person had other roles that would mean this credit gets included for further processing
		// }
		// if(doesItCountNow.continueTree) {
		// 	// Shouldn't need to add to the db here because if continueTree is true, includePerson should have been too
		// 	return true;
		// }

		// TODO: Do writing, directing, and other included crew role thresholds need to be added here is the cumulative total sufficient?
	});

	return _.compact(includedCreditsForContinuation.map(credit => credit.id));
}


/**
 * Look up a TV show's aggregate credits, add the relevant ones to the database,
 * and return the IDs of the people to look up for the next level of the tree.
 * // TODO: Finish this
 * @param showId
 */
async function getAndProcessTvShowAggregateCredits(showId: number): Promise<number[]> {
	const peopleIds: number[] = [];
	await wait(2000);
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
	// Start with cast members who were in at least 50% of episodes
	// TODO: Fine-tune inclusion criteria
	showCredits.cast.forEach(credit => {
		if(credit.episode_count / showDetails.number_of_episodes >= 0.5) {
			peopleIds.push(credit.id);
		}
	});

	return _.uniq(peopleIds);
}
