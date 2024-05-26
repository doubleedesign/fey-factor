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
			return new Date(credit.first_air_date).getFullYear() >= 1994
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
	 * Thresholds for whether to count a person's involvement in a show are difficult
	 * because of the gaping difference in general series lengths 20 years ago vs. today.
	 * This will probably need some tweaking.
	 * // TODO: Finish this next
	 *
	 * @param showEpisodeCount
	 */
	getEpisodeCountThresholds(showEpisodeCount: number) {
		// Girls 5Eva, Mr Mayor
		if(showEpisodeCount < 25) {
			return {
				includePerson: 0,
				continueTree: 0
			};
		}
		// Unbreakable Kimmy Schmidt, The Good Place
		if(showEpisodeCount < 55) {
			return {
				includePerson: 0,
				continueTree: 0
			};
		}
		// 30 Rock, Parks and Rec, Community, Becker, The Office
		if(showEpisodeCount < 140) {
			return {
				includePerson: 0,
				continueTree: 0
			};
		}
		// Brooklyn 99, Scrubs, Just Shoot Me
		if(showEpisodeCount < 200) {
			return {
				includePerson: 0,
				continueTree: 0
			};
		}
		// Friends, Big Bang, Frasier
		else {
			return {
				includePerson: 0,
				continueTree: 0
			};
		}
	},

	/**
	 * Determine if a cast credit should be counted for including the person in the database
	 * and assigning their Fey number the first time the loop hits them
	 *
	 * @param castCredit
	 * @param showEpisodeCount
	 */
	doesCastCreditCountForIncludingThisPerson(castCredit: PersonRoleSummary, showEpisodeCount: number): boolean {
		return castCredit.episode_count >= this.getEpisodeCountThresholds(showEpisodeCount).includePerson;
	},


	/**
	 *
	 * @param castCredit
	 * @param showEpisodeCount
	 */
	doesCastCreditCountForContinuingTheTree(castCredit: PersonRoleSummary, showEpisodeCount: number): boolean {
		return castCredit.episode_count >= this.getEpisodeCountThresholds(showEpisodeCount).continueTree;
	}
};
