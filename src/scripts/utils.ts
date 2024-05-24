import { COMEDY_GENRE_ID, EXCLUDED_GENRE_IDS } from '../common.ts';

export default {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	filterCredits: (credits: any[]) => {
		/**
		 * Note: This already filters out Saturday Night Live based on the start date,
		 * TODO: Handle SNL with specific parameters e.g., involved in the same year
		 */
		return credits.filter(credit => {
			return new Date(credit.first_air_date).getFullYear() >= 1994
				&& credit.genre_ids.includes(COMEDY_GENRE_ID)
				&& !credit.genre_ids.some((genreId: number) => EXCLUDED_GENRE_IDS.includes(genreId));
		});
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	formatCreditData(credit: any) {
		return {
			work_id: credit.id,
			work_name: credit.name,
			role: credit.character ? 'cast' : credit.job,
			episode_count: credit.episode_count
		};
	},

	toSnakeCase(str: string) {
		return str.trim().toLowerCase().replace(/ /g, '_');
	},

	// TODO: This is very arbitrary, needs improvement based on compiling a range of examples
	// there may need to be different thresholds for writing, directing etc compared to acting
	// and there might be some manual exceptions to add
	doesItCount(creditEpisodeCount: number, showEpisodeCount: number) {
		const percentage = (creditEpisodeCount / showEpisodeCount) * 100;

		return percentage >= 30;
	},
};
