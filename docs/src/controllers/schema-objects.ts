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


// TODO: This needs a way to show contextual linking, e.g., episode_count only appears in Role in certain circumstances.
export const gqlEntities: SchemaObject = Object.entries(typeObjects)
	.filter(([, typeObject]) => {
		return typeObject.isGqlEntity && typeObject.isDirectlyQueryable;
	})
	.reduce((acc, [typeName, typeObject]) => {
		let likelyTableName: string = typeFormatToDbTableNameFormat(getTypeForContainerType(typeName));

		// Put specific entities into groups
		if(['VennDiagram', 'VennDiagramIntersection', 'VennDiagramCircle'].includes(typeName)) {
			likelyTableName = 'venn_diagram'; // not actually a table, but works for the purposes this is used for
		}
		if(['Node', 'Edge'].includes(typeName)) {
			likelyTableName = 'network_diagram';
		}
		if(['Work', 'WorkRankingData', 'Provider'].includes(typeName)) {
			likelyTableName = 'works';
		}

		const originalDbTable: Table = dbEntities[likelyTableName]?.entities[0];

		const thisEntity = {
			...originalDbTable,
			tableName: typeName,
			columns: typeObject.fields.map((field) => field.fieldName),
			foreignKeys: originalDbTable ? getForeignKeys(originalDbTable) : fakeForeignKeys(typeName, typeObject.fields),
			gqlOnlyFields: difference(typeObject.fields.map((field) => field.fieldName), originalDbTable?.columns),
			$type: typeName,
		};

		// Update existing
		if (acc[likelyTableName]) {
			acc[likelyTableName].entities.push(thisEntity);
			acc[likelyTableName].entities.sort((a, b) => {
				return a.tableName.localeCompare(b.tableName);
			});

			return acc;
		}
		// Or add new
		else {
			acc[likelyTableName] = {
				name: likelyTableName,
				entities: [thisEntity],
			};
			return acc;
		}
	}, {} as SchemaObject);


// Real foreign keys for entities that exist in the database
function getForeignKeys(originalDbTable: Table) {
	return Object.entries(originalDbTable.foreignKeys as { [key: string]: ForeignKey }).reduce((acc, [key, value]) => {
		acc[key] = {
			...value,
			table: dbTableNameFormatToTypeFormat(value.table),
		};
		return acc;
	}, {} as { [key: string]: ForeignKey });
}

// Custom links between GQL entities that mimic those of foreign key relationships, but are not actual FK relationships in the database
// (usually because at least one of the GQL entities in question is not also a database table)
function fakeForeignKeys(typeName: string, fields: { fieldName: string }[]) {

	return fields.reduce((acc, field) => {
		if(field.fieldName === 'show_id') {
			acc[field.fieldName] = {
				column: field.fieldName,
				table: 'TvShow',
				$type: typeName,
			};
		}

		if(typeName === 'Node' && field.fieldName === 'id') {
			acc[field.fieldName] = {
				column: field.fieldName,
				table: 'Edge',
				$type: typeName,
			};
		}

		if(typeName === 'Edge' && field.fieldName === 'id') {
			acc[field.fieldName] = {
				column: field.fieldName,
				table: 'Node',
				$type: typeName,
			};
		}

		return acc;
	}, {} as { [key: string]: ForeignKey });
}