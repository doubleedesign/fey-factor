export type Movie = Work & {
	release_year?: number;
};

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
	backdrop_path?: string;
	id: number;
	overview?: string;
	people?: Person[];
	poster_path?: string;
	providers?: Provider[];
	rankingData?: RankingData;
	roles?: Role[];
	title: string;
};

export type TvShow = Work & {
	end_year?: number;
	episode_count?: number;
	season_count?: number;
	start_year?: number;
};

export type TvShowAdditionalFields = {
	backdrop_path?: string;
	overview?: string;
	poster_path?: string;
};

export type Edge = {
	id: number;
	nodes: Node[];
	title: string;
};

export type Node = {
	degree: number;
	edges: Edge[];
	id: number;
	name: string;
};
