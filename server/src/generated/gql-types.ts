export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: number; output: number; }
	String: { input: string; output: string; }
	Boolean: { input: boolean; output: boolean; }
	Int: { input: number; output: number; }
	Float: { input: number; output: number; }
};

export type Edge = {
	id: Scalars['ID']['output'];
	nodes: Array<Node>;
	title: Scalars['String']['output'];
};

export type Movie = Work & {
	backdrop_path: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	overview: Maybe<Scalars['String']['output']>;
	people: Maybe<Array<Maybe<Person>>>;
	poster_path: Maybe<Scalars['String']['output']>;
	providers: Maybe<Array<Maybe<Provider>>>;
	rankingData: Maybe<RankingData>;
	release_year: Maybe<Scalars['Int']['output']>;
	roles: Maybe<Array<Maybe<Role>>>;
	title: Scalars['String']['output'];
};


export type MovieProvidersArgs = {
	filter: InputMaybe<ProviderFilter>;
};

export type Node = {
	degree: Scalars['Int']['output'];
	edges: Array<Edge>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
};

export type NodeFilter = {
	id: InputMaybe<Scalars['Int']['input']>;
};

export type Person = {
	degree: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	roles: Maybe<Array<Maybe<Role>>>;
	works: Maybe<Array<Maybe<Work>>>;
};


export type PersonWorksArgs = {
	filter: InputMaybe<WorkFilter>;
};

export type Provider = {
	logo_path: Maybe<Scalars['String']['output']>;
	provider_id: Scalars['Int']['output'];
	provider_name: Scalars['String']['output'];
	provider_type: Maybe<Scalars['String']['output']>;
};

export type ProviderFilter = {
	provider_type: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type RankingData = {
	aggregate_episode_count: Maybe<Scalars['Int']['output']>;
	average_degree: Maybe<Scalars['Float']['output']>;
	total_connections: Maybe<Scalars['Int']['output']>;
	weighted_score: Maybe<Scalars['Float']['output']>;
};

export type Role = {
	episode_count: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	name: Maybe<Scalars['String']['output']>;
};

export type TvShow = Work & {
	backdrop_path: Maybe<Scalars['String']['output']>;
	end_year: Maybe<Scalars['Int']['output']>;
	episode_count: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	overview: Maybe<Scalars['String']['output']>;
	people: Maybe<Array<Maybe<Person>>>;
	poster_path: Maybe<Scalars['String']['output']>;
	providers: Maybe<Array<Maybe<Provider>>>;
	rankingData: Maybe<RankingData>;
	roles: Maybe<Array<Maybe<Role>>>;
	season_count: Maybe<Scalars['Int']['output']>;
	start_year: Maybe<Scalars['Int']['output']>;
	title: Scalars['String']['output'];
};


export type TvShowProvidersArgs = {
	filter: InputMaybe<ProviderFilter>;
};

export type TvShowAdditionalFields = {
	backdrop_path: Maybe<Scalars['String']['output']>;
	overview: Maybe<Scalars['String']['output']>;
	poster_path: Maybe<Scalars['String']['output']>;
};

export type Work = {
	backdrop_path: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	overview: Maybe<Scalars['String']['output']>;
	people: Maybe<Array<Maybe<Person>>>;
	poster_path: Maybe<Scalars['String']['output']>;
	providers: Maybe<Array<Maybe<Provider>>>;
	rankingData: Maybe<RankingData>;
	roles: Maybe<Array<Maybe<Role>>>;
	title: Scalars['String']['output'];
};


export type WorkProvidersArgs = {
	filter: InputMaybe<ProviderFilter>;
};

export type WorkFilter = {
	type: InputMaybe<Scalars['String']['input']>;
};
