import { ReactFlow, type Node, type Edge } from '@xyflow/react';
import typeObjects from '../../../server/src/generated/typeObjects.json';
import { EntityGroup, SchemaObject, Table, TypeObject } from '../types.ts';
import snakeCase from 'lodash/snakeCase';
import { EntityTableGroup } from './EntityTableGroup/EntityTableGroup.tsx';
import { dbTableNameFormatToTypeFormat, getSupertypeOfSubtype, typeFormatToDbTableNameFormat } from '../controllers/utils.ts';
import { useMemo } from 'react';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';

type ForeignKey = {
	table: string;
	column: string;
	$type: unknown;
}

type SchemaDiagramProps = {
	entities: SchemaObject;
	format: 'database' | 'graphql';
}

export function SchemaDiagram({ entities, format }: SchemaDiagramProps) {
	const boxWidth = 272;
	const xOffset = 64;
	const yOffset = 420;

	function calculatePosition(tableName: string) {
		const rowNumber = rows.findIndex(row => row.includes(tableName));
		const itemIndex = rows[rowNumber].indexOf(tableName);
		const noOfItemsInNextRow = rows[rowNumber + 1] ? rows[rowNumber + 1].length : 0;

		// Connections row special handling
		if(rowNumber === 0) {
			return {
				x: (noOfItemsInNextRow * boxWidth) + boxWidth,
				y: yOffset / 4
			};
		}

		// Position subtypes below their supertype
		const supertype = getSupertypeOfSubtype(dbTableNameFormatToTypeFormat(tableName));
		if(supertype) {
			const supertypeIndex = rows[rowNumber - 1].indexOf(typeFormatToDbTableNameFormat(supertype));
			const itemOffset = itemIndex - supertypeIndex;
			return {
				x: ((supertypeIndex * boxWidth) - (xOffset / 1.5)) + (itemOffset * (boxWidth + xOffset)),
				y: rowNumber * yOffset
			};
		}

		return {
			x: (boxWidth * itemIndex) + (xOffset * itemIndex),
			y: rowNumber * yOffset
		};
	}

	// Groupings based on the database schema
	const rows = useMemo(() => {
		// We don't use {Type}Container type names here because they don't exist in the db
		const relevantTypes = Object.keys(entities).filter((typeName: string) => !typeName.endsWith('Container'));

		// Connection types are types that have foreign keys
		const connectionTypes = Object.entries(entities).filter(([_, items]) => {
			return items.entities.some((table: Table) => table.foreignKeys && Object.keys(table.foreignKeys).length > 0);
		}).map(([key]) => typeFormatToDbTableNameFormat(key));

		// Note: I currently only expect one level of subtypes
		const subtypes = uniq(Object.entries(typeObjects as Record<string, TypeObject>)
			.filter(([key, value]) => relevantTypes.includes(typeFormatToDbTableNameFormat(key)) && value?.isSubtypeOf)
			.map(([key]) => typeFormatToDbTableNameFormat(key))
		);

		// "Root" types = standalone and supertype tables that are not connection tables
		const rootTypes = difference(difference(relevantTypes, connectionTypes), subtypes);

		// Position the subtypes across the row by aligning the index of the subtype with the index of its supertype
		const sortedSubtypes: string[] = subtypes.reduce((acc, subtype) => {
			const convertedSubtype = dbTableNameFormatToTypeFormat(subtype);
			const supertype = getSupertypeOfSubtype(convertedSubtype);
			const supertypeIndex = rootTypes.indexOf(typeFormatToDbTableNameFormat(supertype as string));
			if (supertypeIndex === -1) {
				// If the supertype is not found, add the subtype to the end
				acc.push(subtype);
			}
			else {
				// Find the appropriate position for the subtype and insert it there
				let position = supertypeIndex + 1;
				while (acc[position] !== undefined) {
					position++;
				}
				acc.splice(position, 0, subtype);
			}

			return acc;
		}, new Array(subtypes.length) as string[]);

		// Return standalone/supertypes as one row, and subtypes as the second row
		return [connectionTypes, rootTypes, sortedSubtypes];
	}, [entities]);

	const nodes: Node[] = Object.values(entities).map(({ name, entities }: EntityGroup) => {
		return {
			id: name,
			type: 'entity',
			data: { component: <EntityTableGroup entities={entities} format={format}/> },
			position: calculatePosition(name),
		};
	});

	const foreignKeyLinks: Edge[] = Object.values(entities).map((group: EntityGroup) => {
		const table = group.entities[0];
		return Object.keys(table.foreignKeys).map((foreignKey) => {
			const foreignKeyTable = (table.foreignKeys[foreignKey] as ForeignKey);
			return {
				id: `${table.tableName}-${foreignKey}`,
				source: typeFormatToDbTableNameFormat(table.tableName),
				target: typeFormatToDbTableNameFormat((table.foreignKeys[foreignKey] as ForeignKey).table),
				label: `${foreignKeyTable.column} = ${foreignKey}`,
				labelStyle: { transform: 'translateY(-0.75rem)' },
				labelShowBg: false,
				type: 'smoothstep',
			};
		});
	}).flat(1);

	const inheritanceLinks: Edge[] = Object.entries(typeObjects as Record<string, TypeObject>).map(([name, typeObject]) => {
		const parent = typeObject?.isSubtypeOf;
		if (parent) {
			const parentTableName = parent === 'Person' ? 'people' : parent.toLowerCase() + 's';
			const tableName = name === 'Person' ? 'people' : snakeCase(name) + 's';
			return {
				id: `${parentTableName}-${tableName}`,
				source: parentTableName,
				target: tableName,
				label: 'subtype, id = id',
				type: 'smoothstep',
			};
		}
	}).flat(1).filter(edge => edge !== undefined);

	const edges: Edge[] = [...foreignKeyLinks, ...inheritanceLinks];

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={{
				entity: ({ data }) => data.component,
			}}
		/>
	);
}
