export type Person = {
	id: number;
	name: string;
	feyNumber: number;
}

type WorkCommon = {
	id: number;
	name: string;
	release_year: number;
	type: number; // ID of type in the database
}

export type TvShow = WorkCommon & {
	end_year: number;
	episode_count: number;
	season_count: number;
}

export type Film = WorkCommon;
