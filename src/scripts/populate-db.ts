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
const tvId = await db.getWorkTypeId('television');
const movieId = await db.getWorkTypeId('film');
const castRoleId = await db.getRoleId('cast');
const creatorRoleId = await db.getRoleId('creator');
const roles = await db.getRoles();
const includedRoleNames = roles.map(role => role.name);
const skippedRoles = [];
const logFile = createWriteStream('logs/populate-db.log');

db.addOrUpdatePerson({ id: 56323, name: 'Tina Fey', feyNumber: 0 }).then(async () => {
	await processTvShowsFromPerson(56323);
});

async function processTvShowsFromPerson(personId: number) {
	let degrees = 0;

	while (degrees <= 3) {
		try {
			const showIdsToProcessNext: number[] = await getAndProcessTvCreditsForPerson(personId);
			// TODO: Fix this so it gets one unique array of all people found here
			const peopleIdsToProcessNext: number[] = showIdsToProcessNext.forEach(getAndProcessTvShowAggregateCredits);
			degrees++;
			// TODO People need to be added to the database somewhere
			peopleIdsToProcessNext.forEach(processTvShowsFromPerson);
		}
        catch (error) {
			console.error(chalk.red(error.message));
		}
	}
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
		const autoIncludedRoleNames = ['Creator', 'Executive Producer', 'Producer'];
		const autoIncludedRoles: PersonRoleSummary[] = credit.roles.filter(role => autoIncludedRoleNames.includes(role.name));
		if (autoIncludedRoles.length > 0) {
			await db.addOrUpdateTvShow({
				id: credit.id,
				name: credit.name,
				type: tvId,
				start_year: new Date(credit.first_air_date).getFullYear(),
				episode_count: credit.episode_count
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

	return [];
}


// async function handleTvShow(showId: number, feyNumber: number): Promise<number[]> {
// 	await wait(2000);
// 	const showDetails: ShowDetails = await api.getTvShowDetails(showId);
// 	if(showDetails?.type && showDetails.type !== 'Scripted') {
// 		return;
// 	}
//
// 	await wait(2000);
// 	const showCredits: ShowAggregateCredits = await api.getTvShowCredits(showId);
//
// 	const formattedShowData: TvShow = {
// 		id: showId,
// 		name: showDetails.name,
// 		release_year: Number(new Date(showDetails.first_air_date).getFullYear()),
// 		end_year: Number(new Date(showDetails.last_air_date).getFullYear()),
// 		episode_count: showDetails.number_of_episodes,
// 		season_count: showDetails.number_of_seasons,
// 		type: tvId
// 	};
//
// 	// Add the show to the db
// 	await db.addTvShow(formattedShowData);
//
// 	// Add the creator
// 	const creator = {
// 		id: showDetails.created_by.id,
// 		name: showDetails.created_by.name
// 	};
// 	if (creator.id) {
// 		await db.addPerson({
// 			id: creator.id,
// 			name: showDetails.created_by.name,
// 			feyNumber: feyNumber
// 		});
// 		await db.connectPersonToWork(creator.id, showId, creatorRoleId, showDetails.number_of_episodes);
// 	}
//
// 	// Add the notable cast members
// 	const cast: Promise<number>[] = showCredits.cast.map(async (castMember: CastCredit) => {
// 		if(utils.doesItCount(castMember.total_episode_count, showDetails.number_of_episodes)) {
// 			await db.addPerson({ id: castMember.id, name: castMember.name, feyNumber });
// 			await db.connectPersonToWork(castMember.id, showId, castRoleId, castMember.total_episode_count);
// 			return castMember.id;
// 		}
// 	});
//
// 	// Add crew members in defined roles such as writing, directing, producing
// 	const crew: Promise<number>[] = showCredits.crew.map(async (crewMember: CrewCredit) => {
// 		// total_episode_count accounts for all jobs a person had on the show
// 		if(utils.doesItCount(crewMember.total_episode_count, showDetails.number_of_episodes)) {
// 			// All the jobs they had on this show
// 			const jobNames = crewMember.jobs.map((item: CrewJob) => utils.toSnakeCase(item.job));
// 			// The jobs to specifically account for
// 			const jobsToInclude = _.intersection(jobNames, includedRoleNames);
// 			// Record excluded jobs for later review
// 			//const excludedJobs = _.difference(jobs, roleNames);
// 			// if (excludedJobs.length > 0) {
// 			// 	skippedRoles.concat(excludedJobs);
// 			// }
// 			if (jobsToInclude.length < 1) {
// 				return;
// 			}
//
// 			await db.addPerson({ id: crewMember.id, name: crewMember.name, feyNumber });
// 			for (const jobName of jobsToInclude) {
// 				const thisRole = crewMember.jobs.find((job: CrewJob) => utils.toSnakeCase(job.job) === jobName);
// 				const dbRoleId = roles.find(role => role.name === jobName).id;
// 				await db.connectPersonToWork(
// 					crewMember.id,
// 					showId,
// 					dbRoleId,
// 					// number of episodes they had this specific job
// 					thisRole.episode_count
// 				);
// 			}
//
// 			return crewMember.id;
// 		}
// 	});
//
// 	// Return a flattened list of unique IDs of people involved in the show within the defined parameters
// 	// i.e., from whom we should continue the tree
// 	const ids: number[] = await Promise.all(([creator?.id, ...cast, ...crew]));
// 	return _.uniq(ids.flat().filter(id => id !== undefined));
// }
