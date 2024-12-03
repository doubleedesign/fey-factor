export type Edge = {
	id: number;
	nodes?: Node[];
	title: string;
};

export type Movie = Work & {
	release_year?: number;
};

export type Node = {
	degree: number;
	edges?: Edge[];
	id: number;
	name: string;
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

export type Role = {
	episode_count?: number;
	id: number;
	name?: string;
};

export type TvShow = Work & {
	end_year?: number;
	episode_count?: number;
	season_count?: number;
	start_year?: number;
};

export type VennDiagram = {
	circles: VennDiagramCircle[];
	intersections: VennDiagramIntersection[];
};

export type VennDiagramCircle = {
	people_count: number;
	show_id: string;
	title: string;
};

export type VennDiagramIntersection = {
	people_count: number;
	show_ids: string[];
	titles: string[];
};

export type Work = {
	backdrop_path?: string;
	id: number;
	overview?: string;
	people?: Person[];
	poster_path?: string;
	providers?: Provider[];
	ranking_data?: WorkRankingData;
	roles?: Role[];
	title: string;
};

export type WorkRankingData = {
	aggregate_episode_count?: number;
	average_degree?: number;
	total_connections?: number;
	weighted_score?: number;
};
