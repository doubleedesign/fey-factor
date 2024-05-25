import { COMEDY_GENRE_ID, EXCLUDED_GENRE_IDS } from '../common.ts';
import { PersonFormattedCredits, PersonMergedCredit, PersonMergedCredits, PersonRawCredits } from './types-person.ts';
import pkg from 'lodash';
import { TmdbApi } from './tmdb-api.ts';
const { omit, pick } = pkg;

const api = new TmdbApi();

/**
 * Functions to process data fetched from the TMDB API
 * (and occasionally fetch more until I think of a better way to manage this)
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

	filterFormatAndMergeCredits: async (credits: PersonRawCredits): Promise<PersonMergedCredits> => {
		const filtered: PersonRawCredits = tmdbTvData.filterCreditsByYearAndGenre(credits);
		const formatted: PersonFormattedCredits = tmdbTvData.formatCredits(filtered);
		const merged: PersonMergedCredits = tmdbTvData.mergeFormattedCredits(formatted);

		const updated: PersonMergedCredit[] = await Promise.all(merged.credits.map(async (credit) => {
			const creatorRole = credit.roles.find(role => role.name === 'Creator');
			if (creatorRole) {
				const showDetails = await api.getTvShowDetails(credit.id);
				const updatedCreatorRole = {
					...creatorRole,
					episode_count: showDetails.number_of_episodes
				};

				return {
					...credit,
					roles: [
						...credit.roles.filter(role => role.name !== 'Creator'),
						updatedCreatorRole
					]
				};
			}

			return credit;
		}));

		return {
			id: merged.id,
			credits: updated
		};
	}
};
