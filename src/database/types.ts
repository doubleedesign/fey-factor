export type Person = {
	id: number;
	name: string;
	feyNumber: number;
}

type WorkCommon = {
	id: number;
	name: string;
	type: number; // ID of type in the database
}

export type TvShow = WorkCommon & {
	start_year: number;
	end_year?: number;
	episode_count: number;
	season_count?: number;
}

export type Film = WorkCommon & {
	release_year: number;
}
