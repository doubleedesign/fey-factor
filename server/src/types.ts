// These are in addition to the generated types found in the ./generated folder.
// Using interfaces without extending the generated types for simplicity in the generator script.
// TODO: Add the ability to use extended interface and/or intersection types in the generator script
// TODO: Stop this being included directly in the generated Query type
export interface TvShowWithRankingData {
	id: number;
	title: string | null;
	start_year: number | null;
	end_year: number | null;
	season_count: number | null;
	episode_count: number | null;
	total_connections?: number;
	average_degree?: number;
	aggregate_episode_count?: number;
	weighted_score: number;
}