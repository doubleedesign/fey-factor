export type Person = {
	degree?: number;
	id: number;
	name: string;
	roles?: Role[];
	works?: Work[];
};

export type Role = {
	id: number;
	name?: string;
	people?: Person[];
	works?: Work[];
};

export type Work = {
	id: number;
	people?: Person[];
	roles?: Role[];
	title?: string;
};
