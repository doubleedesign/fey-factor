// The types related to person/:id/ API calls

type PersonCreditCommon = {
	id: number; // ID of the show
	name: string; // name of the show
	first_air_date: string;
	last_air_date?: string;
	episode_count?: number; // total episode count for the show itself, not the person
}

/**
 * An individual cast credit for a person as fetched from /person/:id/tv_credits
 */
type PersonCastCredit = PersonCreditCommon & {
	character: string;
}

/**
 * An individual crew credit for a person as fetched from /person/:id/tv_credits
 */
type PersonCrewCredit = PersonCreditCommon & {
	job: string;
}

/**
 * An individual formatted cast or crew credit for a person
 */
type PersonFormattedCredit = PersonCreditCommon & {
	role: string; // Character name or crew job name
	type: string; // cast or crew
}

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
export type PersonMergedCredit = PersonCreditCommon & {
	roles: PersonRoleSummary[];
}

export type PersonRoleSummary = {
	name: string;
	type?: 'cast' | 'crew';
	episode_count?: number; // Person's episode count for the role
}

/**
 * All merged cast and crew credits for a person
 */
export type PersonMergedCredits = {
	id: number;
	credits: PersonMergedCredit[];
}
