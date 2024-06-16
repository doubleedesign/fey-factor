import { DataPopulator, DataPopulatorInterface } from './DataPopulator.ts';
import { customConsole, db, logToFile } from '../common.ts';
import { PopulationScriptSettings } from './types.ts';
import async from 'async';
import { PersonMergedCredit, PersonMergedCredits, PersonMergedFilmCredit } from '../datasources/types-person.ts';
import { tmdbFilmData } from '../datasources/tmdb-film-utils.ts';
import Case from 'case';
import _ from 'lodash';

class MoviePopulator extends DataPopulator implements DataPopulatorInterface {
	RUN_TYPE = 'movies';

	constructor(settings: PopulationScriptSettings) {
		super(settings);
		this.degree = 0;

		// Bind methods to the class instance so that the above properties are available to them
		this.getAndProcessCreditsForPerson = this.getAndProcessCreditsForPerson.bind(this);
		this.getAndProcessCreditsForWork = this.getAndProcessCreditsForWork.bind(this);
		this.addPersonAndWorkToDatabase = this.addPersonAndWorkToDatabase.bind(this);
	}

	async run() {
		const moviesInDb = await db.getAllMovies();
		moviesInDb.length > 0 && moviesInDb.forEach(movie => this.worksAlreadyAdded.add(movie.id));

		await super.run(this.RUN_TYPE);
	}


	/**
	 * Look up a person's film credits by their ID, add the relevant ones to the database,
	 * and return the IDs for the films to look up for the next level of the tree.
	 * @param personId
	 * @param degree
	 */
	async getAndProcessCreditsForPerson(personId: number, degree: number): Promise<number[]> {
		if(this.peopleAlreadyAdded?.[this.RUN_TYPE]?.has(personId)) {
			customConsole.warn(`Person ID ${personId} has already been processed, skipping.`, true);
			return;
		}

		const movieIdsToReturn: number[] = [];

		// All credits for the person, then filtered down to just the kind we're interested in
		const credits = await this.api.getFilmCreditsForPerson(personId);
		if(!credits) {
			customConsole.warn(`Failed to fetch credits for person ID ${personId}, skipping.`, true);
			return;
		}

		const mergedCredits: PersonMergedCredits = tmdbFilmData.filterFormatAndMergeCredits(credits);

		// Loop through each credit (which here, is a movie)
		// remembering that a person may have multiple roles within this movie, e.g., writer and director
		await async.eachSeries(mergedCredits.credits, async (credit: PersonMergedCredit) => {
			const includeAsCrew = credit.roles.some(role => this.includedRoles.includes(Case.snake(role.name)));
			// TODO: Refine inclusion criteria and use/add to the tmbdTVData functions for this
			const includeAsCast = credit.roles.some(role => role.type === 'cast' && role.order <= 12);

			if(includeAsCrew || includeAsCast) {
				await this.addPersonAndWorkToDatabase({
					personId,
					degree,
					workId: credit.id,
					workName: credit.name,
					releaseYear: (credit as PersonMergedFilmCredit).release_year
				});

				await async.eachSeries(credit.roles, async role => {
					await this.connect({
						personId: personId,
						workId: credit.id,
						roleName: role.name,
						count: null
					});
				});

				movieIdsToReturn.push(credit.id);
			}

			// Probably do not need to do anything else here as long as the person had no more than 1 cast roles,
			// but let's see if there's any cases of multiple
			if(credit.roles.filter(role => role.type === 'cast').length > 1) {
				customConsole.warn(`Person ID ${personId} has multiple cast roles in movie ${credit.id} ${credit.name}.`, true);
				logToFile(this.logFile, `Person ID ${personId} has multiple cast roles in movie ${credit.id} ${credit.name}.`);
			}
		});

		return movieIdsToReturn;
	}


	/**
	 * Look up a film's credits, add the relevant ones to the database,
	 * and return the IDs for the people to look up for the next level of the tree.
	 * @param movieId
	 */
	async getAndProcessCreditsForWork(movieId: number): Promise<number[]> {
		customConsole.info(`Processing movie ID ${movieId}.`, true);
		const peopleIdsToReturn: number[] = [];

		// We shouldn't need to fetch movie details and immediately add/update them in the db here
		// because this function has presumably been called after the movie has already been added to the database.
		// this differs from the TV population script because film data is a bit simpler,
		// so films can be added from getAndProcessCreditsForPerson without needing an update here.

		// Fetch and handle credits
		const credits = await this.api.getFilmCredits(movieId);
		if(credits) {
			// Top 12 billed cast members
			const relevantCastIds = credits.cast.length > 0 && credits.cast.filter(credit => credit.order <= 12).map(credit => credit.id);

			// Crew members in included roles
			const crewIds = credits.crew.length > 0 && credits.crew.filter(credit => {
				return this.includedRoles.includes(Case.snake(credit.job));
			}).map(credit => credit.id);

			peopleIdsToReturn.push(...relevantCastIds, ...crewIds);
		}
		else {
			customConsole.warn(`Failed to fetch credits for movie ID ${movieId}, which may have impacted cast and crew inclusion.`, true);
			logToFile(this.logFile, `Failed to fetch credits for movie ID ${movieId}, which may have impacted cast and crew inclusion.`);
		}

		return _.uniq(peopleIdsToReturn);
	}


	/**
	 * Utility function to handle adding a person and movie to the database once it's been determined that they should be included.
	 * NOTE: This assumes TV show population has been done first, so degree may change if a person is added here at a lower degree.
	 * @param personId
	 * @param degree
	 * @param workId
	 * @param workName
	 * @param releaseYear
	 *
	 * @return {Promise<void>}
	 */
	async addPersonAndWorkToDatabase({ personId, degree, workId, workName, releaseYear }): Promise<void> {
		const personExists = await db.getPerson(personId);
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
		else if(personExists && personExists.degree > this.degree) {
			await db.addOrUpdatePerson({
				id: personId,
				name: personExists.name,
				degree: this.degree
			});

			// Record that is person has been added, so we don't add them again in this run
			this.peopleAlreadyAdded[this.RUN_TYPE].add(personId);
		}
		// else person exists but at a lower degree, we don't need to update them

		if(!this.worksAlreadyAdded?.has(workId)) {
			await db.addOrUpdateMovie({
				id: workId,
				name: workName,
				release_year: releaseYear
			});

			this.worksAlreadyAdded.add(workId);
		}
	}
}

export function populateDbMovies({ startPersonId, maxDegree }) {
	new MoviePopulator({ startPersonId, maxDegree }).run().then(() => {
		customConsole.success('Movie population complete.');
	});
}
