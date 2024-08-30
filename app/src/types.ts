export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

export type RankingData = {
	id: number;
	title: string;
	total_connections?: number;
	average_degree?: number;
	aggregate_episode_count?: number;
	weighted_score: number;
};

export type Row = RankingData;