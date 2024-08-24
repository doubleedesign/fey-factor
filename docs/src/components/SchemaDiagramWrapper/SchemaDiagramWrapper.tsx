import { FC, useMemo } from 'react';
import typeObjects from '../../../../server/src/generated/typeObjects.json';
import { StyledSchemaDiagramWrapper } from './SchemaDiagramWrapper.style';
import { dbTableNameFormatToTypeFormat, getSupertypeOfSubtype, typeFormatToDbTableNameFormat } from '../../controllers/utils.ts';
import { EntityGroup, SchemaObject, Table, TypeObject, ForeignKey } from '../../types.ts';
import type { Edge, Node } from '@xyflow/react';
import { SchemaDiagram } from '../SchemaDiagram/SchemaDiagram.tsx';
import { EntityTableGroup } from '../EntityTableGroup/EntityTableGroup.tsx';
import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import snakeCase from 'lodash/snakeCase';

type SchemaDiagramWrapperProps = {
	entities: SchemaObject;
	format: 'database' | 'graphql';
}

export const SchemaDiagramWrapper: FC<SchemaDiagramWrapperProps> = ({ entities, format }) => {
	const boxWidth = 325;
	const xOffset = 64;
	const yOffset = 420;

	function calculatePosition(tableName: string) {
		const rowNumber = rows.findIndex(row => row.includes(tableName));
		const itemIndex = rows[rowNumber].indexOf(tableName);
		const noOfItemsInNextRow = rows[rowNumber + 1] ? rows[rowNumber + 1].length : 0;

		// Special handling for connections row and first row after that
		if(rowNumber === 0) {
			return {
				x: (noOfItemsInNextRow * boxWidth) + boxWidth,
				y: 0
			};
		}
		else if(rowNumber === 1) {
			return {
				x: (boxWidth * itemIndex) + (xOffset * itemIndex),
				y: yOffset / 2
			};
		}
		else {
		// Position subtypes below their supertype
			const supertype = getSupertypeOfSubtype(dbTableNameFormatToTypeFormat(tableName));
			if(supertype) {
				const supertypeIndex = rows[rowNumber - 1].indexOf(typeFormatToDbTableNameFormat(supertype));
				const itemOffset = itemIndex - supertypeIndex;
				return {
					x: ((supertypeIndex * boxWidth) - (xOffset / 1.5)) + (itemOffset * (boxWidth + xOffset)),
					y: (rowNumber * yOffset) - (yOffset / 2)
				};
			}

			return {
				x: (boxWidth * itemIndex) + (xOffset * itemIndex),
				y: ((rowNumber - 1) * yOffset)
			};
		}
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
			data: { component: <EntityTableGroup entities={entities} format={format} id={name}/> },
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
		<StyledSchemaDiagramWrapper data-testid="SchemaDiagramWrapper">
			<SchemaDiagram nodes={nodes} edges={edges} />
		</StyledSchemaDiagramWrapper>
	);
};
