import { DataPopulatorCommon } from './DataPopulatorCommon.ts';
import { PopulationScriptSettings } from './types.ts';
import { customConsole, db } from '../common.ts';
import async from 'async';
import { PersonMergedCredits, PersonMergedTVCredit, PersonTVRoleSummary } from '../datasources/types-person.ts';
import { tmdbTvData } from '../datasources/tmdb-tv-utils.ts';

class DegreeUpdater extends DataPopulatorCommon {

	constructor(settings: PopulationScriptSettings) {
		super(settings);
	}

	async run() {
		await super.setup();

		const degreeZeroTvShows: number[] = (await db.getTvShowsForPerson(this.startPersonId)).map((show) => show.id);
		await async.eachSeries(degreeZeroTvShows, async (showId) => {
			const showCredits = await this.api.getTvShowCredits(showId);
			const simplifiedCastCredits = showCredits.cast.map((credit) => {
				return {
					id: credit.id, // person ID
					name: credit.name, // person's name
					roles: credit.roles.map((role) => {
						return {
							name: role.character,
							type: 'cast',
							episode_count: role.episode_count
						};
					})
				};
			});
			const simplifiedCrewCredits = showCredits.crew.map((credit) => {
				return {
					id: credit.id, // person ID
					name: credit.name,
					roles: credit.roles.map((role) => {
						return {
							name: role.job,
							type: 'crew',
							episode_count: role.episode_count
						};
					})
				};
			});

			const consolidatedCredits: {personId: number; name: string; roles: PersonTVRoleSummary[]}[] = [...simplifiedCastCredits, ...simplifiedCrewCredits].reduce((acc, credit) => {
				const person = acc.find((item) => item.id === credit.id);
				if (person) {
					person.roles.push(...credit.roles);
				}
				else {
					acc.push(credit);
				}
				return acc;
			}, []);

			consolidatedCredits.forEach((credit: { personId: number; name: string; roles: PersonTVRoleSummary[]}) => {
				const eligible = tmdbTvData.doesCumulativeCreditCountForDegreeUpdate(credit.roles);
				if(eligible) {
					db.addOrUpdatePerson({
						id: credit.personId,
						name: credit.name,
						degree: 1
					});

					credit.roles.forEach((role) => {
						// TODO: Fix this, look at the connect() functions in other scripts
						db.connectPersonToWork(credit.personId, showId, roleId, role.episode_count);
					});
				}
			});
		});
	}
}

export function degreeUpdate(settings: PopulationScriptSettings) {
	new DegreeUpdater(settings).run().then(() => {
		customConsole.stopAllProgressBars();
		customConsole.success('Update of eligible degree 2 people to degree 1 complete.');
		customConsole.logProgress('Update of eligible degree 2 people to degree 1 complete.');
	});
}
