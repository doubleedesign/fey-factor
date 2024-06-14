import { COMEDY_GENRE_ID, EXCLUDED_GENRE_IDS } from '../common.ts';
import { PersonFormattedCredits, PersonMergedCredit, PersonMergedCredits, PersonRawCredits, PersonRoleSummary } from './types-person.ts';
import { TmdbApi } from './tmdb-api.ts';
import pkg from 'lodash';
const { omit, pick, compact } = pkg;

const api = new TmdbApi();

/**
 * Functions to process data fetched from the TMDB API
 */
export const tmdbTvData = {

	filterCreditsByYearAndGenre: ({ id, cast, crew }: PersonRawCredits): PersonRawCredits => {
		const includeCredit = (credit) => {
			const timely =
				// Shows that started in the last 20 years
				new Date(credit.first_air_date).getFullYear() >= 2004
				// or were running in the last 20 years even if they started earlier
				|| new Date(credit?.last_air_date)?.getFullYear() >= 2004;

			return timely
				&& credit.origin_country.includes('US')
				&& credit.genre_ids.includes(COMEDY_GENRE_ID)
				&& !credit.genre_ids.some((genreId: number) => EXCLUDED_GENRE_IDS.includes(genreId));
		};

		return {
			id,
			cast: cast.filter(includeCredit),
			crew: crew.filter(includeCredit)
		};
	},

	formatCredits: ({ id, cast, crew }: PersonRawCredits): PersonFormattedCredits => {
		const formatCredit = (credit) => {
			return {
				...pick(credit, ['id', 'name', 'first_air_date', 'last_air_date', 'episode_count']),
				role: credit.character || credit.job,
				type: credit.character ? 'cast' : 'crew'
			};
		};

		return {
			id,
			cast: cast.map(formatCredit),
			crew: crew.map(formatCredit)
		};
	},

	mergeFormattedCredits: ({ id, cast, crew }: PersonFormattedCredits): PersonMergedCredits => {
		const merged: PersonMergedCredit[] = [...cast, ...crew].reduce((acc, current) => {
			const existing = acc.find(item => item.id === current.id);
			if (existing) {
				Object.assign(existing, {
					...omit(current, ['role', 'episode_count', 'type']),
					roles: [...existing.roles, {
						name: current.role,
						type: current.type,
						episode_count: current.episode_count
					}]
				});
			}
			else {
				acc.push({
					...omit(current, ['role', 'episode_count', 'type']),
					roles: [{
						name: current.role,
						type: current.type,
						episode_count: current.episode_count
					}]
				});
			}
			return acc;
		}, []);

		return {
			id,
			credits: merged
		};
	},

	filterFormatAndMergeCredits: (credits: PersonRawCredits): PersonMergedCredits => {
		const filtered: PersonRawCredits = tmdbTvData.filterCreditsByYearAndGenre(credits);
		const formatted: PersonFormattedCredits = tmdbTvData.formatCredits(filtered);

		return tmdbTvData.mergeFormattedCredits(formatted);
	},


	/**
	 * Determine if a credit should be counted for including the person
	 * and assigning their degree the first time the loop hits them,
	 * accounting for all roles they had in the production.
	 * Note: This means that when someone has more than one job in a single episode, it's counted like two episodes. This is intentional.
	 *
	 * This is currently pretty arbitrary and experimental.
	 *
	 * @param credit
	 * @param showEpisodeCount
	 * @returns object
	 */
	doesCumulativeCreditCount(credit: PersonMergedCredit, showEpisodeCount: number) {
		const count = credit.roles.reduce((acc, role) => acc + role.episode_count, 0);
		return {
			inclusion: count / showEpisodeCount >= 0.25, // At least 25% of episodes
			continuation: count / showEpisodeCount >= 0.5 // At least 50% of episodes
		};
	},
};
