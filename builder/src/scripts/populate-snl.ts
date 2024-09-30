import { DataPopulatorCommon } from './DataPopulatorCommon.ts';
import { PopulationScriptSettings } from './types.ts';
import { customConsole, db } from '../common.ts';
import async from 'async';
import { PersonMergedTVCredit, PersonTVRoleSummary } from '../datasources/types-person.ts';
import Case from 'case';

class SnlHandler extends DataPopulatorCommon {
	constructor(settings: PopulationScriptSettings) {
		super(settings);
		this.startPersonId = 56323;
	}

	async run() {
		await super.setup();

		const startAtSeason = 23;
		const endAtSeason = 32;
		const seasonNumbers = Array.from({ length: endAtSeason - startAtSeason + 1 }, (_, i) => i + startAtSeason);

		const totalEpisodes = seasonNumbers.reduce(async (accPromise, number) => {
			const acc = await accPromise;
			try {
				const seasonDetails = await this.api.getTvShowSeasonDetails(1667, number);

				return acc + seasonDetails.episodes.length;
			}
            catch (error) {
				console.error(`Error processing number ${number}:`, error.message);
				return acc; // Return the accumulator without adding if there's an error
			}
		}, Promise.resolve(0));

		const resolvedEpisodeCount = await totalEpisodes;

		await db.addOrUpdateTvShow({
			id: 1667,
			name: 'Saturday Night Live (The Fey Years)',
			start_year: 1997,
			end_year: 2006,
			season_count: startAtSeason - endAtSeason,
			episode_count: resolvedEpisodeCount
		});

		// Now that the show is in the db, go through each season and find and collect people data
		const collection = [];
		await async.eachOfSeries(seasonNumbers, async (number) => {
			const seasonCredits = await this.api.getTvShowCreditsForSpecificSeason(1667, number);

			const simplifiedCastCredits = seasonCredits.cast.map((credit) => {
				return {
					id: credit.id, // person ID
					name: credit.name, // person's name
					// Just include cast once for this
					roles: [{
						name: 'cast',
						type: 'cast',
						episode_count: credit?.total_episode_count
					}]
				};
			});
			const simplifiedCrewCredits = seasonCredits.crew.map((credit) => {
				return {
					id: credit.id, // person ID
					name: credit.name,
					roles: credit.jobs.map((role) => {
						return {
							name: role.job,
							type: 'crew',
							episode_count: role?.episode_count ?? 0 // TODO: How to handle missing crew role episode count
						};
					})
				};
			});

			const consolidatedSeasonCredits: {id: number; name: string; roles: PersonTVRoleSummary[]}[] =
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

			collection.push(...consolidatedSeasonCredits);
		});

		// Consolidate all the season credits into a single array of people
		const consolidatedCreditsByPerson: PersonMergedTVCredit[] = collection.flat().reduce((acc, credit) => {
			const person = acc.find((item) => item.id === credit.id);
			if (person) {
				const allRoles = [...person.roles, ...credit.roles];
				// Consolidate roles by name and add up episode counts across all seasons
				person.roles = allRoles.reduce((acc, role) => {
					const existingRole = acc.find((item) => item.name === role.name);
					if (existingRole) {
						existingRole.episode_count += role.episode_count;
					}
					else {
						acc.push(role);
					}
					return acc;
				}, []);
			}
			else {
				acc.push(credit);
			}
			return acc;
		}, []).flat();

		console.log(consolidatedCreditsByPerson);

		// Loop through the consolidated credits and decide who to add/update in the database, and do so
		await async.eachOfSeries(consolidatedCreditsByPerson, async (credit) => {
			const personTotalEpisodes = (credit.roles as PersonTVRoleSummary[]).reduce((acc, role) => acc + role.episode_count, 0);
			if(personTotalEpisodes < 20) return; // less than a season, skip this person

			// Operating on the assumption that everyone who makes it this far has at least one relevant role and so should be included
			// TODO: If they have a crew role not present in the db, that may cause some minor discrepancies in episode counts
			// (i.e., their total episode count wouldn't match what you would add up from their individual connections)
			await db.addOrUpdatePerson({
				id: credit.id,
				name: credit.name,
				degree: credit.id === 56323 ? 0 : 1
			});

			await async.eachOfSeries(credit.roles, async (role: PersonTVRoleSummary) => {
				// TODO: It'd be better not to query the db every time here
				const roleId: number = await db.getRoleId(Case.snake(role.name));
				if(!roleId) {
					customConsole.warn(`Role ID not found for ${role.name}, skipping.`, true);
					return;
				}

				await db.connectPersonToWork(credit.id, 1667, roleId, role.episode_count);
			});
		});
	}
}

export function addOrUpdateRelevantSnlPeople(settings: PopulationScriptSettings) {
	new SnlHandler(settings).run().then(() => {
		customConsole.stopAllProgressBars();
		customConsole.success('Addition of relevant SNL people complete.');
		customConsole.logProgress('Relevant SNL people added or updated in database.');
	});
}
