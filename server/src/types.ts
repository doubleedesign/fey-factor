// These are in addition to the generated types found in the ./generated folder
// Only types that should be added to the GraphQL schema should be included in this file because the generator script uses it too

// TODO: Copy these notes to some centralised docs
// TYPES vs INTERFACES here and in the generator script:
// Types are used for GQL entities that are not directly queryable
// Non-exported types are used for fields that will be added to other GQL entities by the generator, and will not exist in the schema on their own
// Interfaces are used for GQL entities that are directly queryable
// The third-party pg-to-ts script uses interfaces for everything,
// so further criteria are used for cases where an entity is a database table but should not be directly queryable in the GQL schema

// Dynamically aggregated/calculated data for a TV show
export type WorkRankingData = {
	total_connections?: number;
	average_degree?: number;
	aggregate_episode_count?: number;
	weighted_score?: number;
};

// Assets for a work fetched from the TMDB API when needed
// Not exported because it's not an entity, it's fields that are added to the relevant entities in the generator script
type WorkAdditionalFields = {
	poster_path?: string;
	backdrop_path?: string;
	overview?: string;
	ranking_data?: WorkRankingData;
	providers?: Provider[];
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
	data: VennDiagramSet[];
}

export type VennDiagramSet = {
	id: number;
	name: string;
	sets: string[];
};