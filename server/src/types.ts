// These are in addition to the generated types found in the ./generated folder
// Only types that should be added to the GraphQL schema should be included in this file because the generator script uses it too

export type RankingData = {
	total_connections?: number;
	average_degree?: number;
	aggregate_episode_count?: number;
	weighted_score?: number;
};

export type Provider = {
	provider_id: number;
	provider_name: string;
	logo_path?: string;
	provider_type?: string;
};