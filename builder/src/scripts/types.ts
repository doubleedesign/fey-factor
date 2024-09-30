import {
	PersonFormattedCredits,
	PersonMergedCredit,
	PersonMergedCredits,
	PersonRawCredits,
	PersonTVRoleSummary
} from '../datasources/types-person.ts';

export type PopulationScriptSettings = {
	startPersonId: number;
	maxDegree: number;
};

export type DataWrangler = {
	filterCreditsByYearAndGenre: ({ id, cast, crew }: PersonRawCredits) => PersonRawCredits;
	formatCredits: ({ id, cast, crew }: PersonRawCredits) => PersonFormattedCredits;
	mergeFormattedCredits: ({ id, cast, crew }: PersonFormattedCredits) => PersonMergedCredits;
	filterFormatAndMergeCredits: (credits: PersonRawCredits) => PersonMergedCredits;
	// Extra for TV shows
	doesCumulativeCreditCount?: (credit: PersonMergedCredit, showEpisodeCount: number) => {
		inclusion: boolean,
		continuation: boolean;
	};
	doesCumulativeCreditCountForDegreeUpdate?: (roles: PersonTVRoleSummary[]) => boolean;
	// Extra for films
	doesItCount?: (credit: PersonMergedCredit, includedCrewRoles: string[], degree: number) => {
		cast: {
			include: boolean,
			continue: boolean;
		}
		crew: {
			include: boolean,
			continue: boolean;
		}
	};
}