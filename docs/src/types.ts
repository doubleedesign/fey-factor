export type Table = {
	readonly tableName: string;
	readonly columns: readonly string[];
	readonly requiredForInsert: readonly string[];
	readonly primaryKey: string | null;
	readonly foreignKeys: Record<string, object>;
	readonly $type: unknown;
	readonly $input: unknown;
	gqlOnlyFields?: string[];
};

export type ForeignKey = {
	table: string;
	column: string;
	$type: unknown;
}

export type TypeObject = {
	fields: { fieldName: string, fieldType: any, required: boolean }[];
	isSubtypeOf?: string;
	isInterface?: boolean;
}

export type SchemaObject = {
	[key:string]: EntityGroup;
};

export type EntityGroup = {
	name: string;
	entities: Table[];
}
