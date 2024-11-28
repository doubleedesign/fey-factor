import { DataPopulator, DataPopulatorInterface } from './DataPopulator.ts';
import { customConsole, db, logToFile } from '../common.ts';
import { DataWrangler, PopulationScriptSettings } from './types.ts';
import { PersonMergedCredit, PersonMergedCredits, PersonMergedFilmCredit } from '../datasources/types-person.ts';
import { tmdbFilmData } from '../datasources/tmdb-film-utils.ts';
import async from 'async';
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
	 * @param dataFuncs - object of functions for filtering and formatting data
	 *
	 * @return {Promise<number[]>} An array of movie IDs to look up next
	 */
	async getAndProcessCreditsForPerson(personId: number, degree: number, dataFuncs = tmdbFilmData): Promise<number[]> {
		if(this.peopleAlreadyAdded?.[this.RUN_TYPE]?.has(personId)) {
			customConsole.warn(`Person ID ${personId} has already been processed, skipping.`);
			return;
		}

		const movieIdsToReturn: number[] = [];

		// All film credits for the person, then filtered down to just the kind we're interested in
		const credits = await this.api.getFilmCreditsForPerson(personId);
		if(!credits) {
			customConsole.warn(`Failed to fetch credits for person ID ${personId}, skipping.`);
			return;
		}

		const mergedCredits: PersonMergedCredits = dataFuncs.filterFormatAndMergeCredits(credits);

		// Loop through each credit (which here, is a movie)
		// remembering that a person may have multiple roles within this movie, e.g., writer and director, director and producer
		await async.eachOfSeries(mergedCredits.credits, async (credit: PersonMergedCredit) => {
			const doesItCount = dataFuncs.doesItCount(credit, this.includedRoles, degree);

			if(doesItCount.crew.include || doesItCount.cast.include) {
				await this.addPersonAndWorkToDatabase({
					person: {
						id: personId,
						degree: degree,
					},
					work: {
						id: credit.id,
						name: credit.name,
						release_year: (credit as PersonMergedFilmCredit).release_year
					}
				});

				await async.eachOfSeries(credit.roles, async role => {
					await this.connect({
						personId: personId,
						workId: credit.id,
						roleName: role.type === 'cast' ? 'cast' : role.name,
						count: null
					});
				});
			}

			if(doesItCount.cast.continue || doesItCount.crew.continue) {
				movieIdsToReturn.push(credit.id);
			}
		});

		return movieIdsToReturn;
	}


	/**
	 * Look up a film's credits, add the relevant ones to the database,
	 * and return the IDs for the people to look up for the next level of the tree.
	 * @param movieId
	 */
	async getAndProcessCreditsForWork(movieId: number, dataFuncs = tmdbFilmData): Promise<number[]> {
		customConsole.info(`Processing movie ID ${movieId}.`);
		const peopleIdsToReturn: number[] = [];

		// We shouldn't need to fetch movie details and immediately add/update them in the db here
		// because this function has presumably been called after the movie has already been added to the database.
		// this differs from the TV population script because film data is a bit simpler,
		// so films can be added from getAndProcessCreditsForPerson without needing an update here.

		// Fetch and handle credits
		const credits = await this.api.getFilmCredits(movieId);
		if(credits) {
			// Top 12 billed cast members
			const relevantCastIds = credits.cast
				.filter(credit => credit.order <= 12)
				.map(credit => credit.id) || [];

			// Crew members in included roles
			const crewIds = credits.crew
				.filter(credit => this.includedRoles.includes(Case.snake(credit.job)))
				.map(credit => credit.id) || [];

			peopleIdsToReturn.push(...relevantCastIds, ...crewIds);
		}
		else {
			customConsole.warn(`Failed to fetch credits for movie ID ${movieId}, which may have impacted cast and crew inclusion.`);
			logToFile(this.logFile, `Failed to fetch credits for movie ID ${movieId}, which may have impacted cast and crew inclusion.`);
		}

		return _.uniq(peopleIdsToReturn);
	}


	/**
	 * Utility function to handle adding a person and movie to the database once it's been determined that they should be included.
	 * NOTE: This assumes TV show population has been done first, so degree may change if a person is added here at a lower degree.
	 * @param person
	 * @param work
	 *
	 * @return {Promise<void>}
	 */
	async addPersonAndWorkToDatabase({ person, work }): Promise<void> {
		let personData = await db.getPerson(person.id);
		const personExists = !!personData;
		const existingDegree = personData?.degree;
		if (!personExists) {
			personData = await this.api.getPersonDetails(person.id);
		}
		if(!personExists || existingDegree > person.degree) {
			await db.addOrUpdatePerson({
				id: person.id,
				name: personData.name,
				degree: person.degree // the new degree
			});

			// Record that is person has been added, so we don't add them again in this run
			this.peopleAlreadyAdded[this.RUN_TYPE].add(person.id);
		}
		// else person exists but at a lower degree, we don't need to update them

		if(!this.worksAlreadyAdded?.has(work.id)) {
			await db.addOrUpdateMovie(work);

			this.worksAlreadyAdded.add(work.id);
		}
	}
}

export function populateDbMovies({ startPersonId, maxDegree }) {
	new MoviePopulator({ startPersonId, maxDegree }).run().then(() => {
		customConsole.success('Movie population complete.');
	});
}
