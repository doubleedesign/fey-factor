import { dbTableNameFormatToTypeFormat, getSupertypeOfSubtype, typeFormatToDbTableNameFormat } from './utils.ts';


describe('utils', () => {

	describe('Type format to database table name format', () => {
		test('TvShow', () => {
			expect(typeFormatToDbTableNameFormat('TvShow')).toEqual('tv_shows');
		});

		test('Movie', () => {
			expect(typeFormatToDbTableNameFormat('Movie')).toEqual('movies');
		});

		test('Person', () => {
			expect(typeFormatToDbTableNameFormat('Person')).toEqual('people');
		});

		test('Work', () => {
			expect(typeFormatToDbTableNameFormat('Work')).toEqual('works');
		});
	});

	describe('Database table name format to Type format', () => {
		test('tv_shows', () => {
			expect(dbTableNameFormatToTypeFormat('tv_shows')).toEqual('TvShow');
		});

		test('movies', () => {
			expect(dbTableNameFormatToTypeFormat('movies')).toEqual('Movie');
		});

		test('people', () => {
			expect(dbTableNameFormatToTypeFormat('people')).toEqual('Person');
		});

		test('works', () => {
			expect(dbTableNameFormatToTypeFormat('works')).toEqual('Work');
		});
	});

	describe('Get supertype of subtype', () => {
		test('Person', () => {
			expect(getSupertypeOfSubtype('Person')).toBe(false);
		});

		test('TvShow', () => {
			expect(getSupertypeOfSubtype('TvShow')).toEqual('Work');
		});

		test('Movie', () => {
			expect(getSupertypeOfSubtype('Movie')).toEqual('Work');
		});
	});
});