import theme from './theme.ts';
import { ReactNode } from 'react';
import cytoscape from 'cytoscape';

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

export type Provider = {
	provider_id: number;
	provider_name: string;
	provider_type: string;
	logo_path: string;
};

export type Row = RankingData & {
	available_on?: Provider[];
	episode_count?: number;
};

export type Column = {
	value: keyof Row | 'rank';
	label: string;
	tooltip?: string;
};

export type Edition = {
	personId: number;
	title: string;
	tag?: string;
};

export type SingleSelectOption = {
	label: string;
	value: string;
};

export type MultiSelectOption = {
	value: string;
	label: ReactNode;
};

export type Filters = {
	available_on?: string[];
	// TODO: Add more filter keys here and then make sure they're accounted for in the filter function
};

export type NetworkObject = {
	nodes: cytoscape.NodeDefinition[];
	edges: cytoscape.EdgeDefinition[];
};

export type VennSet = {
	id: string;
	name: string;
	sets: string[];
};