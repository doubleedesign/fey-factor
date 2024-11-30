// These are in addition to the generated types found in the ./generated folder
// Only types that should be added to the GraphQL schema should be included in this file because the generator script uses it too

// Dynamically aggregated/calculated data for a TV show
export type RankingData = {
	total_connections?: number;
	average_degree?: number;
	aggregate_episode_count?: number;
	weighted_score?: number;
};

// Assets for a TV show fetched from the TMDB API when needed
export type TvShowAdditionalFields = {
	poster_path?: string;
	backdrop_path?: string;
	overview?: string;
	// Note for future ref: The API can also give production companies
};

// Watch providers fetched from the TMDB API
export type Provider = {
	provider_id: number;
	provider_name: string;
	logo_path?: string;
	provider_type?: string;
};

// Basically the core Person fields from the db source types + edges,
// we just can't import from generated types file here because it breaks the generator
export interface Node {
	id: number;
	name: string;
	degree: number;
	edges: Edge[];
}

// Basically a TvShow + nodes,
// we just can't import from generated types file here because it breaks the generator
export interface Edge {
	id: number;
	title: string;
	nodes: Node[];
}

export interface VennDiagram {
	intersections: VennDiagramIntersection[];
	circles: VennDiagramCircle[];
}

export type VennDiagramIntersection = {
	titles: string[];
	show_ids: string[];
	people_count: number;
};

export type VennDiagramCircle = {
	title: string;
	show_id: string;
	people_count: number;
};