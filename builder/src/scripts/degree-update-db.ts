import { DataPopulatorCommon } from './DataPopulatorCommon.ts';
import { PopulationScriptSettings } from './types.ts';
import { customConsole, db } from '../common.ts';
import { PersonTVRoleSummary } from '../datasources/types-person.ts';
import { tmdbTvData } from '../datasources/tmdb-tv-utils.ts';
import async from 'async';
import Case from 'case';

class DegreeUpdater extends DataPopulatorCommon {

	constructor(settings: PopulationScriptSettings) {
		super(settings);
	}

	async run() {
		await super.setup();

		const degreeZeroTvShows: number[] = await db.getTvShowIdsForPerson(this.startPersonId);
		await async.eachOfSeries(degreeZeroTvShows, async (showId) => {
			const showCredits = await this.api.getTvShowCredits(showId);
			if(!showCredits.cast || !showCredits.crew) {
				customConsole.error(`Problem fetching credits for show ID ${showId}`);
				return;
			}
			if(!Array.isArray(showCredits.cast) || !Array.isArray(showCredits.crew)) {
				customConsole.error(`Problem with credits data for show ID ${showId}`);
				return;
			}

			const simplifiedCastCredits = showCredits.cast.map((credit) => {
				return {
					id: credit.id, // person ID
					name: credit.name, // person's name
					roles: credit.roles.map((role) => {
						return {
							name: 'cast',
							type: 'cast',
							episode_count: role.episode_count ?? 0
						};
					})
				};
			});
			const simplifiedCrewCredits = showCredits.crew.map((credit) => {
				return {
					id: credit.id, // person ID
					name: credit.name,
					roles: credit.jobs.map((role) => {
						return {
							name: role.job,
							type: 'crew',
							episode_count: role.episode_count ?? 0
						};
					})
				};
			});

			const consolidatedCredits: {id: number; name: string; roles: PersonTVRoleSummary[]}[] =
				[...simplifiedCastCredits, ...simplifiedCrewCredits].reduce((acc, credit) => {
					const person = acc.find((item) => item.id === credit.id);
					if (person) {
						person.roles.push(...credit.roles);
					}
					else {
						acc.push(credit);
					}
					return acc;
				}, []);

			// eslint-disable-next-line max-len
			await async.eachOfSeries(consolidatedCredits, async (credit) => {
				const eligible = tmdbTvData.doesCumulativeCreditCountForDegreeUpdate(credit.roles);
				if(eligible) {
					await db.addOrUpdatePerson({
						id: credit.id,
						name: credit.name,
						degree: 1
					});

					// TODO: There's a small number of these for which the roleId is not found, so the connection is not made but the person was already updated
					// This might explain some discrepancies, but not sure if it matters at the time of writing
					await async.eachOfSeries(credit.roles, async (role) => {
						// TODO: It'd be better not to query the db every time here
						const roleId: number = await db.getRoleId(Case.snake(role.name));
						if(!roleId) {
							customConsole.warn(`Role ID not found for ${role.name}, skipping.`);
							return;
						}
						await db.connectPersonToWork(credit.id, showId, roleId, role?.episode_count ?? 0);
					});
				}
			});
		});
	}
}

export function degreeUpdate(settings: PopulationScriptSettings) {
	new DegreeUpdater(settings).run().then(() => {
		customConsole.success('Update of eligible degree 2 people to degree 1 complete.');
	});
}
