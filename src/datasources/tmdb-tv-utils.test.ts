import tinaFey from './cache/person/56323/tv_credits.json';
import { tmdbTvData } from './tmdb-tv-utils';
import { PersonFormattedCredits, PersonMergedCredits, PersonRawCredits } from './types-person';
import { TypeChecker } from '@doubleedesign/type-checker';

describe('TV data processing', () => {

	describe('Basic data processing', () => {
		test('filter credits by year and genre', () => {
			const filtered: PersonRawCredits = tmdbTvData.filterCreditsByYearAndGenre(tinaFey);

			expect(filtered.cast).toHaveLength(10);
			expect(filtered.crew).toHaveLength(11);
		});

		test('format filtered credits', () => {
			const filtered: PersonRawCredits = tmdbTvData.filterCreditsByYearAndGenre(tinaFey);
			const formatted: PersonFormattedCredits = tmdbTvData.formatCredits(filtered);

			expect(TypeChecker.getType(formatted.cast[0])).toEqual(expect.arrayContaining(['PersonFormattedTVCredit']));
			expect(TypeChecker.getType(formatted.crew[0])).toEqual(expect.arrayContaining(['PersonFormattedTVCredit']));
		});

		test('merge filtered and formatted credits', () => {
			const merged: PersonMergedCredits = tmdbTvData.filterFormatAndMergeCredits(tinaFey);

			expect(merged.credits).toHaveLength(10);
			expect(TypeChecker.getType(merged.credits[0])).toEqual(expect.arrayContaining(['PersonMergedTVCredit']));
		});
	});

	describe('With Tina Fey\'s real credits', () => {
		const filtered = tmdbTvData.filterCreditsByYearAndGenre(tinaFey);
		const formatted = tmdbTvData.formatCredits(filtered);
		const merged = tmdbTvData.mergeFormattedCredits(formatted);
		const thirtyRock = merged.credits.find(credit => credit.name === '30 Rock');

		it('collects all roles for 30 Rock', () => {
			expect(thirtyRock.roles).toHaveLength(4);
		});

		it('returns roles in the correct format', () => {
			expect(thirtyRock.roles[0]).toEqual({
				name: 'Liz Lemon',
				type: 'cast',
				episode_count: 138
			});
		});

		it('correctly differentiates cast and crew roles', () => {
			const crewRoles = thirtyRock.roles.filter(role => role.type === 'crew');
			expect(crewRoles).toHaveLength(3);
		});
	});
});
