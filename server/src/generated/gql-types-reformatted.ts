export type Person = {
	degree?: number;
	id: number;
	name: string;
	roles?: Role[];
	works?: Work[];
};

export type Provider = {
	logo_path?: string;
	provider_id: number;
	provider_name: string;
	provider_type?: string;
};

export type RankingData = {
	aggregate_episode_count?: number;
	average_degree?: number;
	total_connections?: number;
	weighted_score?: number;
};

export type Role = {
	episode_count?: number;
	id: number;
	name?: string;
};

export type Work = {
	id: number;
	people?: Person[];
	providers?: Provider[];
	rankingData?: RankingData;
	roles?: Role[];
	title: string;
};

// TODO: Generator script doesn't currently add these
export type TvShow = Work & {
	start_year?: number;
	end_year?: number;
	season_count?: number;
	episode_count?: number;
};

export type Movie = Work & {
	release_year?: number;
};
