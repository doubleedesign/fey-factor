import tinaFey from '../test-data/person/56323/tv_credits.json';
import { tmdbTvData } from './tmdb-tv-utils';
import { PersonFormattedCredits, PersonMergedCredits, PersonRawCredits } from './types-person';
import { TypeChecker } from '@doubleedesign/type-checker';

describe('TV data processing', () => {

	describe('Basic data processing', () => {
		test('filter credits by year and genre', () => {
			const filtered: PersonRawCredits = tmdbTvData.filterCreditsByYearAndGenre(tinaFey);

			expect(filtered.cast).toHaveLength(10);
			expect(filtered.crew).toHaveLength(12);
		});

		test('format filtered credits', () => {
			const filtered: PersonRawCredits = tmdbTvData.filterCreditsByYearAndGenre(tinaFey);
			const formatted: PersonFormattedCredits = tmdbTvData.formatCredits(filtered);

			expect(TypeChecker.getType(formatted.cast[0])).toEqual(['PersonFormattedCredit']);
			expect(TypeChecker.getType(formatted.crew[0])).toEqual(['PersonFormattedCredit']);
		});

		test('merge filtered and formatted credits', () => {
			const filtered: PersonRawCredits = tmdbTvData.filterCreditsByYearAndGenre(tinaFey);
			const formatted: PersonFormattedCredits = tmdbTvData.formatCredits(filtered);
			const merged: PersonMergedCredits = tmdbTvData.mergeFormattedCredits(formatted);

			expect(merged.credits).toHaveLength(11);
			expect(TypeChecker.getType(merged.credits[0])).toEqual(expect.arrayContaining(['PersonMergedCredit']));
		});
	});

	describe('With Tina Fey\'s real credits', () => {
		const filtered: PersonRawCredits = tmdbTvData.filterCreditsByYearAndGenre(tinaFey);
		const formatted: PersonFormattedCredits = tmdbTvData.formatCredits(filtered);
		const merged: PersonMergedCredits = tmdbTvData.mergeFormattedCredits(formatted);

		const thirtyRock = merged.credits.find(credit => credit.name === '30 Rock');

		it('collects all roles for 30 Rock', () => {
			expect(thirtyRock.roles).toHaveLength(4);

			console.log(thirtyRock.roles);
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


		it('has the correct episode count for the creator credit', () => {
			const creatorCredit = thirtyRock.roles.find(role => role.name === 'Creator');
			expect(creatorCredit.episode_count).toEqual(138);
		});
	});
});
