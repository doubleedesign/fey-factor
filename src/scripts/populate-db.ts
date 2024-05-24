/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection UnnecessaryLocalVariableJS

import { TmdbApi } from '../datasources/tmdb-api.ts';
import { db, logToFile, wait } from '../common.ts';
import utils from './utils.ts';
import _ from 'lodash';
import chalk from 'chalk';
import { createWriteStream } from 'fs';
import { CastCredit, CrewJob, CrewCredit, ShowAggregateCredits, ShowDetails } from '../datasources/types.ts';
import { TvShow } from '../database/types.ts';

const api = new TmdbApi();
const tvId = await db.getWorkTypeId('television');
const movieId = await db.getWorkTypeId('film');
const castRoleId = await db.getRoleId('cast');
const creatorRoleId = await db.getRoleId('creator');
const roles = await db.getRoles();
const includedRoleNames = roles.map(role => role.name);
const skippedRoles = [];
const logFile = createWriteStream('logs/populate-db.log');

db.addPerson({ id: 56323, name: 'Tina Fey', feyNumber: 0 }).then(() => {
	processTvShowsFromPerson(56323).then(() => {
		logToFile(logFile, `Skipped roles: ${skippedRoles.join(', ')}`);
		console.log(chalk.green('------------------------------------------------'));
		console.log(chalk.green('Finished processing TV shows'));
		console.log(chalk.green('------------------------------------------------'));

		// TODO: Process movies
	});
});

async function processTvShowsFromPerson(personId: number) {
	const degrees = 3;
	let feyNumber = 1;

	while (feyNumber <= degrees) {
		// Add the person to the db and get the shows they've been involved in
		const credits = await getTvCreditsForPerson(personId);
		// The IDs of their shows
		const showIds = credits.map(credit => credit.work_id);
		// Add those shows to the db and come back with the people involved in those shows
		const nextPeople: number[] = await Promise.all(
			showIds.map(showId => handleTvShow(showId, feyNumber))).then(people => people.flat()
		);

		console.log(nextPeople);

		feyNumber++;

		await wait(2000);
		nextPeople.forEach(processTvShowsFromPerson);
	}
}

async function getTvCreditsForPerson(personId: number) {
	await wait(2000);
	const tvData = await api.getTvCreditsForPerson(personId);
	const credits = [];
	tvData?.cast && credits.push(...tvData.cast);
	tvData?.crew && credits.push(...tvData.crew);
	const tvCreditsFiltered = utils.filterCredits(credits);
	const formattedCredits = tvCreditsFiltered.map(utils.formatCreditData);

	return formattedCredits;
}

async function handleTvShow(showId: number, feyNumber: number): Promise<number[]> {
	await wait(2000);
	const showDetails: ShowDetails = await api.getTvShowDetails(showId);
	if(showDetails?.type && showDetails.type !== 'Scripted') {
		return;
	}

	await wait(2000);
	const showCredits: ShowAggregateCredits = await api.getTvShowCredits(showId);

	const formattedShowData: TvShow = {
		id: showId,
		name: showDetails.name,
		release_year: Number(new Date(showDetails.first_air_date).getFullYear()),
		end_year: Number(new Date(showDetails.last_air_date).getFullYear()),
		episode_count: showDetails.number_of_episodes,
		season_count: showDetails.number_of_seasons,
		type: tvId
	};

	// Add the show to the db
	await db.addTvShow(formattedShowData);

	// Add the creator
	const creator = {
		id: showDetails.created_by.id,
		name: showDetails.created_by.name
	};
	if (creator.id) {
		await db.addPerson({
			id: creator.id,
			name: showDetails.created_by.name,
			feyNumber: feyNumber
		});
		await db.connectPersonToWork(creator.id, showId, creatorRoleId, showDetails.number_of_episodes);
	}

	// Add the notable cast members
	const cast: Promise<number>[] = showCredits.cast.map(async (castMember: CastCredit) => {
		if(utils.doesItCount(castMember.total_episode_count, showDetails.number_of_episodes)) {
			await db.addPerson({ id: castMember.id, name: castMember.name, feyNumber });
			await db.connectPersonToWork(castMember.id, showId, castRoleId, castMember.total_episode_count);
			return castMember.id;
		}
	});

	// Add crew members in defined roles such as writing, directing, producing
	const crew: Promise<number>[] = showCredits.crew.map(async (crewMember: CrewCredit) => {
		// total_episode_count accounts for all jobs a person had on the show
		if(utils.doesItCount(crewMember.total_episode_count, showDetails.number_of_episodes)) {
			// All the jobs they had on this show
			const jobNames = crewMember.jobs.map((item: CrewJob) => utils.toSnakeCase(item.job));
			// The jobs to specifically account for
			const jobsToInclude = _.intersection(jobNames, includedRoleNames);
			// Record excluded jobs for later review
			//const excludedJobs = _.difference(jobs, roleNames);
			// if (excludedJobs.length > 0) {
			// 	skippedRoles.concat(excludedJobs);
			// }
			if (jobsToInclude.length < 1) {
				return;
			}

			await db.addPerson({ id: crewMember.id, name: crewMember.name, feyNumber });
			for (const jobName of jobsToInclude) {
				const thisRole = crewMember.jobs.find((job: CrewJob) => utils.toSnakeCase(job.job) === jobName);
				const dbRoleId = roles.find(role => role.name === jobName).id;
				await db.connectPersonToWork(
					crewMember.id,
					showId,
					dbRoleId,
					// number of episodes they had this specific job
					thisRole.episode_count
				);
			}

			return crewMember.id;
		}
	});

	// Return a flattened list of unique IDs of people involved in the show within the defined parameters
	// i.e., from whom we should continue the tree
	const ids: number[] = await Promise.all(([creator?.id, ...cast, ...crew]));
	return _.uniq(ids.flat().filter(id => id !== undefined));
}
