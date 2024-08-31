import theme from './theme.ts';

export type ThemeColor = keyof typeof theme.colors;

export type ThemeSpacingSize = keyof typeof theme.spacing;

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

export type Column = {
	value: keyof Row | 'rank';
	label: string;
	tooltip?: string;
};
