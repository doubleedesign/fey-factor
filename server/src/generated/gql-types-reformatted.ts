export type Person = {
	degree?: number;
	id: number;
	name: string;
	works?: Work[];
};

export type Role = {
	episode_count?: number;
	id: number;
	name?: string;
};

export type Work = {
	id: number;
	people?: Person[];
	title?: string;
};
