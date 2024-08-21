export type Connection = {
	episode_count?: number;
	id: number;
	person?: PersonContainer;
	person_id: number;
	role?: RoleContainer;
	role_id: number;
	work?: WorkContainer;
	work_id: number;
};

export type ConnectionContainer = {
	episode_count?: number;
	id: number;
	person_id: number;
	role_id: number;
	work_id: number;
};

export type Person = {
	connections?: ConnectionContainer[];
	degree?: number;
	id: number;
	name?: string;
	roles?: RoleContainer[];
	works?: WorkContainer[];
};

export type PersonContainer = {
	degree?: number;
	id: number;
	name?: string;
};

export type Role = {
	connections?: ConnectionContainer[];
	id: number;
	name?: string;
	people?: PersonContainer[];
	works?: WorkContainer[];
};

export type RoleContainer = {
	id: number;
	name?: string;
};

export type Work = {
	connections?: ConnectionContainer[];
	id: number;
	people?: PersonContainer[];
	roles?: RoleContainer[];
	title?: string;
};

export type WorkContainer = {
	id: number;
	title?: string;
};
