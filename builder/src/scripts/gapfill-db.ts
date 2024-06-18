import { customConsole, db } from '../common.ts';
import async from 'async';
import { PopulationScriptSettings } from './types.ts';
import { DataPopulatorCommon } from './DataPopulatorCommon.ts';

export class GapFiller extends DataPopulatorCommon {

	constructor(settings: PopulationScriptSettings) {
		super(settings);
	}

	async run() {
		await super.setup();

		const showsUpdated = await this.fillInTvShows();
		const creatorRolesFixed = await this.fixCreatorRoles();

		return {
			showsUpdated,
			creatorRolesFixed
		};
	}

	/**
	 * Shows that were looked up and added when processing people would not have been fully populated
	 * if getAndProcessCreditsForWork() was not run for them in populateDb().
	 */
	async fillInTvShows() {
		let updated = 0;

		// Get shows that don't have episode counts
		const shows = await db.pgClient.query(
			'SELECT id FROM tv_shows WHERE episode_count IS NULL LIMIT 100;'
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


	/**
	 * Workaround for episode counts for creator roles not being populated properly in populateDb()
	 */
	async fixCreatorRoles() {
		let updated = 0;

		// Get connections that don't have episode counts
		const shows = await db.pgClient.query(`
			SELECT DISTINCT(work_id) from connections 
			    JOIN tv_shows ON connections.work_id = tv_shows.id 
             	WHERE connections.episode_count is NULL
		`);
		const showIds = shows.rows.map(show => show.work_id);
		customConsole.addProgressBar('gap_filling', showIds.length);

		// For each show, get the total episode count and update the creator connection to use that
		await async.eachSeries(showIds, async showId => {
			const show = await db.pgClient.query('SELECT episode_count FROM tv_shows WHERE id = $1', [showId]);
			if(show.rows.length > 0) {
				const episodeCount = show.rows[0].episode_count;
				await db.pgClient.query({
					// TODO: This assumes null counts are creators or other roles that can use the show's total, which may not be true
					text: 'UPDATE connections SET episode_count = $1 WHERE work_id = $2',
					values: [episodeCount, showId]
				});

				updated++;
				customConsole.updateProgress('gap_filling', updated);
			}
			else {
				customConsole.warn(`Could not find episode count for show ${showId} in database, querying API...`);
				const showDetails = await this.api.getTvShowDetails(showId);
				if(showDetails) {
					await db.addOrUpdateTvShow({
						id: showId,
						name: showDetails.name,
						start_year: showDetails.start_year,
						end_year: showDetails.end_year,
						episode_count: showDetails.number_of_episodes,
						season_count: showDetails.number_of_seasons
					});

					await db.pgClient.query({
						// TODO: This assumes null counts are creators or other roles that can use the show's total, which may not be true
						text: 'UPDATE connections SET episode_count = $1 WHERE work_id = $2',
						values: [showDetails.number_of_episodes, showId]
					});

					updated++;
					customConsole.updateProgress('gap_filling', updated);
				}
				else {
					customConsole.error(`Could not find episode count for show ${showId}.`);
				}
			}
		});

		return updated;
	}
}


export function gapFillDb(settings: PopulationScriptSettings) {
	new GapFiller(settings).run().then(updated => {
		customConsole.stopAllProgressBars();
		customConsole.success(`Gaps filled for ${updated.showsUpdated} shows.`, true);
		customConsole.success(`${updated.creatorRolesFixed} creator episode counts fixed.`, true);
		customConsole.logProgress(`Gap filled for ${updated.showsUpdated} shows. ${updated.creatorRolesFixed} creator episode counts fixed.`);
	});
}
