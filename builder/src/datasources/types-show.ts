// The types related to tv/:id
// and  tv/:id/aggregate_credits API calls

type ShowCreditCommon = {
	id: number; // ID of the show
	name: string; // name of the show
	first_air_date: string;
	last_air_date?: string;
}

/**
 * The summary of cast and crew credits for a show as fetched from /tv/:id/aggregate_credits
 */
export type ShowAggregateCredits = {
	id: number; // The show ID
	cast: ShowCastCredit[];
	crew: ShowCrewCredit[];
}

/**
 * The details of a show as fetched from /tv/:id
 */
export type ShowDetails = ShowCreditCommon & {
	number_of_episodes: number;
	created_by: ShowCreatorCredit[];
	genres: Genre[];
	type: string;
	number_of_seasons: number;
	// Some fields not currently used, but I might care about later so making a note of them here
	episode_run_time: number;
	in_production: boolean;
	status: string;
	networks: unknown[];
	production_companies: [];
}

/**
 * An individual person's cast credit in a show as fetched from /tv/:id/aggregate_credits
 */
export type ShowCastCredit = ShowCreditCommon & {
	roles: ShowCastRole[];
	episode_count: number;
}

/**
 * An individual person's crew credit in a show as fetched from /tv/:id/aggregate_credits
 */
export type ShowCrewCredit = ShowCreditCommon & {
	jobs: ShowCrewJob[];
	episode_count: number;
}

/**
 * The credit for the show's creator(s) as fetched from /tv/:id
 */
export type ShowCreatorCredit = {
	id: number; // person ID
	name: string; // person's name
	[key: string]: unknown;
}


type ShowCastRole = {
	credit_id: string; // NOT the show ID - this is a unique identifier for the credit
	character: string;
	episode_count: number;
}

type ShowCrewJob = {
	credit_id: string; // NOT the show ID - this is a unique identifier for the credit
	job: string; // The name of the job e.g., writer, director
	episode_count: number;
}

export type Genre = {
	id: number;
	name: string;
}
