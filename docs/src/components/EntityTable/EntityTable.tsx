import { FC, useMemo } from 'react';
import { StyledEntityTable } from './EntityTable.style';
import { Handle, Position } from '@xyflow/react';
import { tables } from '../../../../server/src/generated/source-types';
import { Table, TypeObject } from '../../types.ts';
import { PrimaryKeyIcon, PrimaryKeyInheritedIcon, ForeignKeyIcon } from '../Icon';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import typeObjects from '../../../../server/src/generated/typeObjects.json';
import { typeFormatToDbTableNameFormat } from '../../controllers/utils.ts';
import { LinkToNode } from '../LinkToNode/LinkToNode.tsx';

type EntityTableProps = {
	table: Table;
	format: 'database' | 'graphql';
}

function getDataType(typeName: string, columnName: string, format: 'database'|'graphql') {
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

function isSubtype(tableName: string) {
	return ['tv_shows', 'movies'].includes(tableName); // TODO: Match these properly
}

function isConnectionTable(tableName: string) {
	// @ts-expect-error TS7053: Element implicitly has an any type because expression of type string can't be used to index type {}
	const tableObject = tables[(typeFormatToDbTableNameFormat(tableName))];
	return tableObject ? tableObject.foreignKeys && Object.keys(tableObject.foreignKeys).length > 0 : false;
}

function getParentTable(tableName: string) {
	return ['tv_shows', 'movies'].includes(tableName) ? tables.works : undefined; // TODO: Match these properly
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
			};
		}).sort((a, b) => {
			if (a.isPrimaryKey && !b.isPrimaryKey) {
				return -1;
			}
			if (!a.isPrimaryKey && b.isPrimaryKey) {
				return 1;
			}
			if (a.isForeignKey && !b.isForeignKey) {
				return 1;
			}
			if (!a.isForeignKey && b.isForeignKey) {
				return -1;
			}
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
						const rowClass = row.isPrimaryKey ? 'primary-key' : row.isForeignKey ? 'foreign-key' : '';
						const singularDataType = row.dataType.replace('[', '').replace(']', '');
						return (
							<tr key={row.columnName} className={rowClass}>
								<td className="icon">
									{row.isPrimaryKey && <PrimaryKeyIcon/>}
									{row.isInheritedPrimaryKey && <PrimaryKeyInheritedIcon/>}
									{row.isForeignKey && <ForeignKeyIcon/>}
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
