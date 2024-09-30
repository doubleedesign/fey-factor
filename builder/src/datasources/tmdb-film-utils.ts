import {
	PersonFilmRoleSummary,
	PersonFormattedCredits,
	PersonFormattedFilmCredit,
	PersonMergedCredit,
	PersonMergedCredits,
	PersonRawCredits
} from './types-person.ts';
import { COMEDY_GENRE_ID, EXCLUDED_GENRE_IDS, START_YEAR } from '../common.ts';
import Case from 'case';
import pkg from 'lodash';
import { DataWrangler } from '../scripts/types.ts';
const { pick } = pkg;

export const tmdbFilmData: DataWrangler = {

	filterCreditsByYearAndGenre: ({ id, cast, crew }: PersonRawCredits): PersonRawCredits => {
		const includeCredit = (credit) => {
			const timely = new Date(credit.release_date).getFullYear() >= START_YEAR;

			return timely
				// Note: origin_country is not available from the /person/:id/movie_credits endpoint,
				// so for simplicity it's not used at this stage.
				// If it becomes needed, it would need to be fetched and added to the object passed to this function
				&& credit.genre_ids.includes(COMEDY_GENRE_ID)
				&& !credit.genre_ids.some((genreId: number) => EXCLUDED_GENRE_IDS.includes(genreId));
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
				...pick(credit, ['id', 'order']),
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
					...pick(current, ['id', 'name', 'release_year']),
					roles: [...existing.roles, {
						name: current.role,
						type: current.type,
						order: (current as PersonFormattedFilmCredit)?.order
					}]
				});
			}
			else {
				acc.push({
					...pick(current, ['id', 'name', 'release_year']),
					roles: [{
						name: current.role,
						type: current.type,
						order: (current as PersonFormattedFilmCredit)?.order
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
	},

	doesItCount(credit: PersonMergedCredit, includedCrewRoles: string[], degree: number) {
		return {
			crew: {
				include: credit.roles.some(role => includedCrewRoles.includes(Case.snake(role.name))),
				continue: credit.roles.some(role => ['screenplay'].includes(Case.snake(role.name))),
			},
			cast: {
				include: credit.roles.some(role => {
					// include top 13 billed for degrees 0-1;
					// this is a quick arbitrary choice based on Amy Poehler for original Mean Girls and Jon Hamm for the remake
					return degree < 2
						? role.type === 'cast' && (role as PersonFilmRoleSummary).order <= 13
						// I was getting too many results, so reduced the criteria for degrees > 1 to the top 5
						: role.type === 'cast' && (role as PersonFilmRoleSummary).order <= 4;
				}),
				continue: credit.roles.some(role => {
					return degree < 2
						// Top 5 billed cast members for degrees 0-1
						? role.type === 'cast' && (role as PersonFilmRoleSummary).order <= 4
						// Top 2 billed cast members for degrees > 1 because I was getting too many results otherwise
						: role.type === 'cast' && (role as PersonFilmRoleSummary).order <= 1;
				})
			}
		};
	},
};
