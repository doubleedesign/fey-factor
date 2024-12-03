import { FC, useMemo } from 'react';
import { StyledEntityTable } from './EntityTable.style';
import { Handle, Position } from '@xyflow/react';
import { tables } from '../../../../server/src/generated/source-types';
import { Table, TypeObject } from '../../types.ts';
import { PrimaryKeyIcon, PrimaryKeyInheritedIcon, ForeignKeyIcon } from '../Icon';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import typeObjects from '../../../../server/src/generated/typeObjects.json';
import { dbTableNameFormatToTypeFormat, getSupertypeOfSubtype, typeFormatToDbTableNameFormat } from '../../controllers/utils.ts';
import { LinkToNode } from '../LinkToNode/LinkToNode.tsx';
import { GraphQLIcon } from '../Icon/GraphQLIcon.tsx';

type EntityTableProps = {
	table: Table;
	format: 'database' | 'graphql';
}

export const EntityTable: FC<EntityTableProps> = ({ table, format }) => {
	const allCustomTypeNames = Object.keys(typeObjects);
	const processedRows = useMemo(() => {
		const typeName =
			table.tableName === 'people'
				? 'Person'
				: upperFirst(camelCase(table.tableName.endsWith('s') ? table.tableName.slice(0, -1) : table.tableName));

		return table.columns.map((columnName) => {
			return {
				columnName,
				dataType: getDataType(typeName, columnName, format),
				isPrimaryKey: table.primaryKey === columnName,
				isInheritedPrimaryKey: isSubtype(table.tableName) && getParentTable(table.tableName)?.primaryKey === columnName,
				isForeignKey: table.foreignKeys[columnName] !== undefined,
				isGqlAddedField: table?.gqlOnlyFields?.includes(columnName) ?? false,
			};
		}).sort((a, b) => {
			// Sort by primary key
			if (a.isPrimaryKey && !b.isPrimaryKey) return -1;
			if (!a.isPrimaryKey && b.isPrimaryKey) return 1;
			if (a.isInheritedPrimaryKey && !b.isInheritedPrimaryKey ) return -1;
			if (!a.isInheritedPrimaryKey  && b.isInheritedPrimaryKey ) return 1;

			// Sort by foreign key
			if (a.isForeignKey && !b.isForeignKey) return -1;
			if (!a.isForeignKey && b.isForeignKey) return 1;

			// Place gqlAddedFields at the bottom
			if (!a.isPrimaryKey && !a.isForeignKey && !b.isGqlAddedField) return -1;
			if (!b.isPrimaryKey && !b.isForeignKey && a.isGqlAddedField) return 1;

			// If they are the same in all respects, maintain their current order
			return 0;
		});
	}, [table.columns, table.primaryKey, table.foreignKeys]);

	return (
		<div>
			<Handle
				type="source"
				position={getSourceHandlePosition(table.tableName)}
				id={`${table.tableName}`}
			/>
			<Handle
				type="target"
				position={getTargetHandlePosition(table.tableName)}
				id={`${table.tableName}`}
			/>
			<StyledEntityTable data-testid="EntityTable">
				<thead>
					<tr>
						<th colSpan={3}>{table.tableName}</th>
					</tr>
				</thead>
				<tbody>
					{processedRows.map((row) => {
						let rowClass = '';
						if(row.isPrimaryKey || row.isInheritedPrimaryKey) {
							rowClass = 'primary-key';
						}
						else if(row.isForeignKey) {
							rowClass = 'foreign-key';
						}
						else if(row.isGqlAddedField) {
							rowClass = 'gql-added-field';
						}
						const singularDataType = row.dataType.replace('[', '').replace(']', '');
						return (
							<tr key={row.columnName} className={rowClass}>
								<td className="icon">
									{row.isPrimaryKey && <PrimaryKeyIcon/>}
									{row.isInheritedPrimaryKey && <PrimaryKeyInheritedIcon/>}
									{row.isForeignKey && <ForeignKeyIcon/>}
									{row.isGqlAddedField && <GraphQLIcon/>}
								</td>
								<td>{row.columnName}</td>
								<td className="data-type">
									<span>{
										allCustomTypeNames.includes(singularDataType)
											? (<LinkToNode id={singularDataType}>{row.dataType}</LinkToNode>)
											: row.dataType
									}</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</StyledEntityTable>
		</div>
	);
};

function getDataType(typeName: string, columnName: string, format: 'database'|'graphql') {
	if (!(typeObjects as Record<string, TypeObject>)[typeName]) {
		console.warn(`Type ${typeName} does not exist in typeObjects, skipping`);
		return '';
	}

	const tsType = (typeObjects as Record<string, TypeObject>)[typeName].fields.find((field) => field.fieldName === columnName)?.fieldType;
	// These are some assumptions but hey, it's for my database
	if(tsType.endsWith('[]') && format === 'graphql') {
		return `[${tsType.replace('[]', '')}]`;
	}
	switch(tsType) {
		case 'number':
			return format === 'database' ? 'int' : 'Int';
		case 'string':
			return format === 'database' ? 'varchar' : 'String';
		default:
			return tsType;
	}
}

function isSubtype(typeName: string) {
	// @ts-expect-error TS7053: Element implicitly has an any type because expression of type string can't be used to index type
	return (typeObjects[dbTableNameFormatToTypeFormat(typeName)] as TypeObject)?.isSubtypeOf;
}

function isConnectionTable(tableName: string) {
	// @ts-expect-error TS7053: Element implicitly has an any type because expression of type string can't be used to index type {}
	const tableObject = tables[(typeFormatToDbTableNameFormat(tableName))];
	return tableObject ? tableObject.foreignKeys && Object.keys(tableObject.foreignKeys).length > 0 : false;
}

function getParentTable(tableName: string) {
	const supertype = getSupertypeOfSubtype(dbTableNameFormatToTypeFormat(tableName)) || getSupertypeOfSubtype(tableName);
	if(!supertype) {
		return false;
	}

	const parent = typeFormatToDbTableNameFormat(supertype);

	// @ts-expect-error TS7053: Element implicitly has an any type because expression of type string can't be used to index type
	return tables[parent];
}

function getSourceHandlePosition(tableName: string) {
	if(isConnectionTable(tableName)) {
		return Position.Left;
	}
	return isSubtype(tableName) ? Position.Top : Position.Bottom;
}

function getTargetHandlePosition(tableName: string) {
	if(isConnectionTable(tableName)) {
		return Position.Left;
	}
	return Position.Top;
}
