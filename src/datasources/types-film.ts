// The types related to movie/:id
// and  movie/:id/credits API calls

type FilmCreditCommon = {
	id: number;
	title: string;
	release_year: string;
}

/**
 * The summary of cast and crew credits for a film as fetched from /movie/:id/credits
 */
export type FilmCredits = {
	id: number;
	cast: FilmCastCredit[];
	crew: FilmCrewCredit[];
}

type FilmPersonCommon = {
	id: number;
	name: string;
}

/**
 * An individual person's cast credit in a film as fetched from /movie/:id/credits
 */
type FilmCastCredit = FilmPersonCommon & {
	character: string;
	order: number;
}

/**
 * An individual person's crew credit in a film as fetched from /movie/:id/credits
 */
type FilmCrewCredit = FilmPersonCommon & {
	job: string;
}
