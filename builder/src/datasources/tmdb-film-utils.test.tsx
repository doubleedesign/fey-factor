import tinaFey from './cache/person/56323/movie_credits.json';
import { PersonFormattedCredits, PersonMergedCredits, PersonRawCredits } from './types-person.ts';
import { tmdbFilmData } from './tmdb-film-utils.ts';
import { TypeChecker } from '@doubleedesign/type-checker';

const includedCrewRoles = [
	'cast',
	'writer',
	'director',
	'executive_producer',
	'co-executive_producer',
	'producer',
	'co_producer',
	'associate_producer',
	'creator',
	'supervising_producer',
	'composer',
	'story_editor',
	'executive_story_editor',
	'screenplay',
	'screenwriter',
	'director_of_photography',
	'casting',
	'casting_director',
	'original_music_composer',
	'art_direction',
];

describe('Film data processing', () => {

	describe('basic data processing', () => {

		test('filter credits by year and genre', () => {
			// @ts-expect-error TS2345: Argument of type is not assignable to type PersonRawCredits // TODO: Fix this
			const filtered: PersonRawCredits = tmdbFilmData.filterCreditsByYearAndGenre(tinaFey);

			expect(filtered.cast).toHaveLength(32);
			expect(filtered.crew).toHaveLength(15);
		});

		test('format filtered credits', () => {
			// @ts-expect-error TS2345: Argument of type is not assignable to type PersonRawCredits // TODO: Fix this
			const filtered: PersonRawCredits = tmdbFilmData.filterCreditsByYearAndGenre(tinaFey);
			const formatted: PersonFormattedCredits = tmdbFilmData.formatCredits(filtered);

			expect(TypeChecker.getType(formatted.cast[0])).toEqual(expect.arrayContaining(['PersonFormattedFilmCredit']));
			expect(TypeChecker.getType(formatted.crew[0])).toEqual(expect.arrayContaining(['PersonFormattedFilmCredit']));
		});

		test('merge filtered and formatted credits', () => {
			// @ts-expect-error TS2345: Argument of type is not assignable to type PersonRawCredits // TODO: Fix this
			const merged: PersonMergedCredits = tmdbFilmData.filterFormatAndMergeCredits(tinaFey);

			expect(merged.credits).toHaveLength(34);
			expect(TypeChecker.getType(merged.credits[0])).toEqual(expect.arrayContaining(['PersonMergedFilmCredit']));
		});
	});

	describe('Inclusion and continuation', () => {
		// @ts-expect-error TS2345: Argument of type is not assignable to type PersonRawCredits // TODO: Fix this
		const filtered = tmdbFilmData.filterCreditsByYearAndGenre(tinaFey);
		const formatted = tmdbFilmData.formatCredits(filtered);
		const merged = tmdbFilmData.mergeFormattedCredits(formatted);

		test('include as crew', async () => {
			const credit = merged.credits.find(credit => credit.id === 10625);
			const doesItCount = tmdbFilmData.doesItCount(credit, includedCrewRoles);

			expect(doesItCount.crew.include).toBe(true);
		});

		test('continue as crew', async () => {
			const credit = merged.credits.find(credit => credit.id === 10625);
			const doesItCount = tmdbFilmData.doesItCount(credit, includedCrewRoles);

			expect(doesItCount.crew.continue).toBe(true);
		});

		test('include as cast', () => {
			const credit = merged.credits.find(credit => credit.id === 10625);
			const doesItCount = tmdbFilmData.doesItCount(credit, includedCrewRoles);

			expect(doesItCount.cast.include).toBe(true);
		});

		test('continue as cast', async () => {
			const credit = merged.credits.find(credit => credit.id === 35056);
			const doesItCount = tmdbFilmData.doesItCount(credit, includedCrewRoles);

			expect(doesItCount.cast.continue).toBe(true);
		});

		test('do not include or continue', () => {
			const credit = merged.credits.find(credit => credit.id === 14137);
			const doesItCount = tmdbFilmData.doesItCount(credit, includedCrewRoles);

			expect(doesItCount.crew.include).toBe(false);
			expect(doesItCount.cast.include).toBe(false);
		});

		test('include but do not continue', () => {
			const credit = merged.credits.find(credit => credit.id === 513083);
			const doesItCount = tmdbFilmData.doesItCount(credit, includedCrewRoles);

			expect(doesItCount.crew.continue).toBe(false);
			expect(doesItCount.cast.continue).toBe(false);
		});
	});

	describe('Tina Fey\'s real credits', () => {
		// @ts-expect-error TS2345: Argument of type is not assignable to type PersonRawCredits // TODO: Fix this
		const filtered = tmdbFilmData.filterCreditsByYearAndGenre(tinaFey);
		const formatted = tmdbFilmData.formatCredits(filtered);
		const merged = tmdbFilmData.mergeFormattedCredits(formatted);
		const meanGirls1 = merged.credits.find(credit => credit.id === 10625);

		it('collects all roles for original Mean Girls', () => {
			expect(meanGirls1.roles).toHaveLength(2);
		});

		it('returns roles in the correct format', () => {
			expect(meanGirls1.roles[0]).toEqual({
				name: 'Ms. Norbury',
				order: 9,
				type: 'cast',
			});
		});

		it('correctly differentiates cast and crew roles', () => {
			const crewRoles = meanGirls1.roles.filter(role => role.type === 'crew');
			expect(crewRoles).toHaveLength(1);
		});

		it('correctly selects which films to continue the tree from', () => {
			const result: number[] = merged.credits.filter(credit => {
				const counts = tmdbFilmData.doesItCount(credit, includedCrewRoles);
				return counts.cast.continue || counts.crew.continue;
			}).map(credit => credit.id);

			expect(result.length).toBe(19);
		});
	});
});
