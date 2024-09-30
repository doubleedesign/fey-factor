// The types related to person/:id/ API calls

type PersonCreditCommon = {
	id: number; // ID of the show/movie
	name: string; // name of the show/movie
}

// TODO: This name is misleading
type PersonTVCommon = PersonCreditCommon & {
	first_air_date?: string;
	last_air_date?: string;
	episode_count?: number;
}

type PersonFilmCommon = PersonCreditCommon & {
	release_year?: string;
	order?: number; // crew roles only; TODO this could probably be improved given it's the "common" type
}

/**
 * An individual cast credit for a person as fetched from /person/:id/tv_credits
 */
type PersonCastCredit = PersonCreditCommon & (PersonTVCommon | PersonFilmCommon) & {
	character: string;
};

/**
 * An individual crew credit for a person as fetched from /person/:id/tv_credits
 */
type PersonCrewCredit = PersonCreditCommon & (PersonTVCommon | PersonFilmCommon) & {
	job: string;
};

/**
 * An individual formatted cast or crew credit for a person
 */
type PersonFormattedCreditCommon = {
	role: string; // Character name or crew job name
	type: string; // cast or crew
};
export type PersonFormattedTVCredit = PersonTVCommon & PersonFormattedCreditCommon;
export type PersonFormattedFilmCredit = PersonFilmCommon & PersonFormattedCreditCommon;
export type PersonFormattedCredit = PersonFormattedTVCredit | PersonFormattedFilmCredit;

/**
 * The raw cast and crew credits for a person as fetched from /person/:id/tv_credits
 */
export type PersonRawCredits = {
	id: number;
	cast: PersonCastCredit[];
	crew: PersonCrewCredit[];
}

/**
 * The formatted cast and crew credits for a person
 */
export type PersonFormattedCredits = {
	id: number;
	cast: PersonFormattedCredit[];
	crew: PersonFormattedCredit[];
}

/**
 * A single merged credit for a person,
 * combining cast and crew roles in the same production
 */
export type PersonMergedTVCredit = PersonCreditCommon & PersonTVCommon & {
	roles: PersonRoleSummary[];
}
export type PersonMergedFilmCredit = PersonCreditCommon & PersonFilmCommon & {
	roles: PersonRoleSummary[];
}
export type PersonMergedCredit = PersonMergedTVCredit | PersonMergedFilmCredit;

export type PersonRoleSummaryCommon = {
	name: string;
	type?: 'cast' | 'crew';
}
export type PersonTVRoleSummary = PersonRoleSummaryCommon & {
	episode_count?: number; // Person's episode count for the role in a TV show
}
export type PersonFilmRoleSummary = PersonRoleSummaryCommon & {
	order?: number; // Position of the person in the film cast list, where top billing is 0
}
export type PersonRoleSummary = PersonTVRoleSummary | PersonFilmRoleSummary;

/**
 * All merged cast and crew credits for a person
 */
export type PersonMergedCredits = {
	id: number;
	credits: PersonMergedCredit[];
}
