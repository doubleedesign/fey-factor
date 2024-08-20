export type Connection = {
	episode_count?: number;
	id: number;
	person?: PersonItem;
	person_id: number;
	role?: RoleItem;
	role_id: number;
	work?: WorkItem;
	work_id: number;
};

export type ConnectionItem = {
	episode_count?: number;
	id: number;
	person_id: number;
	role_id: number;
	work_id: number;
};

export type Person = {
	connections?: ConnectionItem[];
	degree?: number;
	id: number;
	name?: string;
	roles?: RoleItem[];
	works?: WorkItem[];
};

export type PersonItem = {
	degree?: number;
	id: number;
	name?: string;
};

export type Role = {
	connections?: ConnectionItem[];
	id: number;
	name?: string;
	people?: PersonItem[];
	works?: WorkItem[];
};

export type RoleItem = {
	id: number;
	name?: string;
};

export type Work = {
	connections?: ConnectionItem[];
	id: number;
	people?: PersonItem[];
	roles?: RoleItem[];
	title?: string;
};

export type WorkItem = {
	id: number;
	title?: string;
};
