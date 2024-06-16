import { DataPopulator, DataPopulatorInterface } from './DataPopulator.ts';
import { customConsole, db } from '../common.ts';
import { PopulationScriptSettings } from './types.ts';

class MoviePopulator extends DataPopulator implements DataPopulatorInterface {

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
		moviesInDb.forEach(movie => this.worksAlreadyAdded.add(movie.id));

		await super.run();
	}

	async getAndProcessCreditsForPerson(personId: number, degree: number): Promise<number[]> {
		return [];
	}

	async getAndProcessCreditsForWork(movieId: number): Promise<number[]> {
		return [];
	}
}

export function populateDbMovies({ startPersonId, maxDegree }) {
	new MoviePopulator({ startPersonId, maxDegree }).run().then(() => {
		customConsole.success('Movie population complete.');
	});
}
