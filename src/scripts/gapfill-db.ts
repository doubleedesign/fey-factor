import { DataPopulator, DataPopulatorInterface } from './DataPopulator.ts';
import { customConsole, db } from '../common.ts';
import async from 'async';

export class GapFiller extends DataPopulator implements DataPopulatorInterface {

	constructor() {
		super();
	}

	async run() {
		super.runMessageQueue();
		return await this.fillInTvShows();
	}

	/**
	 * Shows that were looked up and added when processing people would not have been fully populated
	 * if getAndProcessTvShowAggregateCredits() was not run for them in populateDb().
	 */
	async fillInTvShows() {
		let updated = 0;

		// Get shows that don't have episode counts
		const shows = await db.pgClient.query(
			'SELECT id, title FROM tv_shows WHERE episode_count IS NULL LIMIT 100;'
		);

		await async.eachSeries(shows.rows, async ({ id, title }) => {
			const showDetails = await this.api.getTvShowDetails(id);
			if(showDetails) {
				await db.addOrUpdateTvShow({
					id: id,
					name: title,
					start_year: showDetails.start_year,
					end_year: showDetails.end_year,
					episode_count: showDetails.number_of_episodes,
					season_count: showDetails.number_of_seasons
				});
				updated++;
			}
			else {
				customConsole.error(`Could not find details for show ${id} ${title}.`);
			}
		});

		return updated;
	}
}


export function gapFillDb() {
	new GapFiller().run().then(updated => {
		customConsole.success(`Gaps filled for ${updated} shows.`, true);
	});
}
