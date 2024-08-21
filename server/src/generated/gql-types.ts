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

export type Connection = {
	episode_count: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	person: Maybe<PersonContainer>;
	person_id: Scalars['Int']['output'];
	role: Maybe<RoleContainer>;
	role_id: Scalars['Int']['output'];
	work: Maybe<WorkContainer>;
	work_id: Scalars['Int']['output'];
};

export type ConnectionContainer = {
	episode_count: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	person_id: Scalars['Int']['output'];
	role_id: Scalars['Int']['output'];
	work_id: Scalars['Int']['output'];
};

export type Movie = Work & {
	connections: Maybe<Array<Maybe<ConnectionContainer>>>;
	id: Scalars['ID']['output'];
	people: Maybe<Array<Maybe<PersonContainer>>>;
	release_year: Maybe<Scalars['Int']['output']>;
	roles: Maybe<Array<Maybe<RoleContainer>>>;
	title: Maybe<Scalars['String']['output']>;
};

export type MovieContainer = WorkContainer & {
	id: Scalars['ID']['output'];
	release_year: Maybe<Scalars['Int']['output']>;
	title: Maybe<Scalars['String']['output']>;
};

export type Person = {
	connections: Maybe<Array<Maybe<ConnectionContainer>>>;
	degree: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	name: Maybe<Scalars['String']['output']>;
	roles: Maybe<Array<Maybe<RoleContainer>>>;
	works: Maybe<Array<Maybe<WorkContainer>>>;
};

export type PersonContainer = {
	degree: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	name: Maybe<Scalars['String']['output']>;
};

export type Role = {
	connections: Maybe<Array<Maybe<ConnectionContainer>>>;
	id: Scalars['ID']['output'];
	name: Maybe<Scalars['String']['output']>;
	people: Maybe<Array<Maybe<PersonContainer>>>;
	works: Maybe<Array<Maybe<WorkContainer>>>;
};

export type RoleContainer = {
	id: Scalars['ID']['output'];
	name: Maybe<Scalars['String']['output']>;
};

export type TvShow = Work & {
	connections: Maybe<Array<Maybe<ConnectionContainer>>>;
	end_year: Maybe<Scalars['Int']['output']>;
	episode_count: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	people: Maybe<Array<Maybe<PersonContainer>>>;
	roles: Maybe<Array<Maybe<RoleContainer>>>;
	season_count: Maybe<Scalars['Int']['output']>;
	start_year: Maybe<Scalars['Int']['output']>;
	title: Maybe<Scalars['String']['output']>;
};

export type TvShowContainer = WorkContainer & {
	end_year: Maybe<Scalars['Int']['output']>;
	episode_count: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	season_count: Maybe<Scalars['Int']['output']>;
	start_year: Maybe<Scalars['Int']['output']>;
	title: Maybe<Scalars['String']['output']>;
};

export type Work = {
	connections: Maybe<Array<Maybe<ConnectionContainer>>>;
	id: Scalars['ID']['output'];
	people: Maybe<Array<Maybe<PersonContainer>>>;
	roles: Maybe<Array<Maybe<RoleContainer>>>;
	title: Maybe<Scalars['String']['output']>;
};

export type WorkContainer = {
	id: Scalars['ID']['output'];
	title: Maybe<Scalars['String']['output']>;
};
