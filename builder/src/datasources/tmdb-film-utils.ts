import { PersonFormattedCredits, PersonFormattedFilmCredit, PersonMergedCredits, PersonRawCredits } from './types-person.ts';
import { COMEDY_GENRE_ID, EXCLUDED_GENRE_IDS, START_YEAR } from '../common.ts';
import pkg from 'lodash';
const { pick } = pkg;

export const tmdbFilmData = {

	filterCreditsByYearAndGenre: ({ id, cast, crew }: PersonRawCredits): PersonRawCredits => {
		const includeCredit = (credit) => {
			const timely = new Date(credit.release_date).getFullYear() >= START_YEAR;

			return timely
				// Note: origin_country is not available from the /person/:id/movie_credits endpoint,
				// so for simplicity it's not used at this stage.
				// If it becomes needed, it would need to be fetched and added to the object passed to this function
				&& credit.genre_ids.includes(COMEDY_GENRE_ID)
				&& !EXCLUDED_GENRE_IDS.includes(credit.genre_ids);
		};

		return {
			id,
			cast: cast.filter(includeCredit),
			crew: crew.filter(includeCredit)
		};
	},

	formatCredits({ id, cast, crew }: PersonRawCredits): PersonFormattedCredits {
		const formatCredit = (credit) => {
			return {
				...pick(credit, ['id']),
				name: credit.title,
				release_year: new Date(credit.release_date).getFullYear().toString(),
				role: credit.character || credit.job,
				type: credit.character ? 'cast' : 'crew'
			} as PersonFormattedFilmCredit;
		};

		return {
			id,
			cast: cast.map(formatCredit),
			crew: crew.map(formatCredit)
		};
	},

	mergeFormattedCredits({ id, cast, crew }: PersonFormattedCredits): PersonMergedCredits {
		const merged = [...cast, ...crew].reduce((acc, current) => {
			const existing = acc.find(item => item.id === current.id);
			if (existing) {
				Object.assign(existing, {
					...current,
					roles: [...existing.roles, {
						name: current.role,
						type: current.type,
					}]
				});
			}
			else {
				acc.push({
					...current,
					roles: [{
						name: current.role,
						type: current.type
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

	filterFormatAndMergeCredits(credits: PersonRawCredits): PersonMergedCredits {
		const filtered = tmdbFilmData.filterCreditsByYearAndGenre(credits);
		const formatted = tmdbFilmData.formatCredits(filtered);

		return tmdbFilmData.mergeFormattedCredits(formatted);
	}
};
