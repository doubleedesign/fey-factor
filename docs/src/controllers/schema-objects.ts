import { tables } from '../../../server/src/generated/source-types';
import typeObjects from '../../../server/src/generated/typeObjects.json';
import { ForeignKey, SchemaObject, Table } from '../types.ts';
import { typeFormatToDbTableNameFormat, dbTableNameFormatToTypeFormat, getTypeForContainerType } from './utils';
import difference from 'lodash/difference';

export const dbEntities: SchemaObject = Object.entries(tables).reduce((acc, [tableName, table]) => {
	acc[tableName] = {
		name: tableName,
		entities: [
			{
				...table,
				$type: dbTableNameFormatToTypeFormat(tableName),
			}
		]
	};

	return acc;
}, {} as SchemaObject);


export const gqlEntities: SchemaObject = Object.entries(typeObjects).reduce((acc, [typeName, typeObject]) => {
	const likelyTableName: string = typeFormatToDbTableNameFormat(getTypeForContainerType(typeName));
	const originalDbTable: Table = dbEntities[likelyTableName].entities[0];

	const thisEntity = {
		...originalDbTable,
		tableName: typeName,
		columns: typeObject.fields.map((field) => field.fieldName),
		foreignKeys: Object.entries(originalDbTable.foreignKeys as {[key: string]: ForeignKey}).reduce((acc, [key, value]) => {
			acc[key] = {
				...value,
				table: typeName.endsWith('Container')
					? `${dbTableNameFormatToTypeFormat(value.table)}Container`
					: dbTableNameFormatToTypeFormat(value.table),
			};
			return acc;
		}, {} as {[key: string]: ForeignKey}),
		gqlOnlyFields: difference(typeObject.fields.map((field) => field.fieldName), originalDbTable.columns),
		$type: typeName,
	};

	if(acc[likelyTableName]) {
		acc[likelyTableName].entities.push(thisEntity);
		return acc;
	}
	else {
		acc[likelyTableName] = {
			name: likelyTableName,
			entities: [thisEntity],
		};
		return acc;
	}
}, {} as SchemaObject);
