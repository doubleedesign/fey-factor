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