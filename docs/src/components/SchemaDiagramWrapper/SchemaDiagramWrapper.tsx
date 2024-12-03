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
import camelCase from 'lodash/camelCase';

type SchemaDiagramWrapperProps = {
	entities: SchemaObject;
	format: 'database' | 'graphql';
}

export const SchemaDiagramWrapper: FC<SchemaDiagramWrapperProps> = ({ entities, format }) => {
	const boxWidth = 325;
	const xOffset = 64;
	const yOffset = 300;

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
					y: (rowNumber * yOffset)
				};
			}

			// Manually adjust offsets for some types
			if(tableName === 'venn_diagram' || tableName === 'network_diagram') {
				return {
					x: ((boxWidth * itemIndex) + (xOffset * itemIndex)) - (boxWidth / 2),
					y: ((rowNumber - 1.5) * yOffset)
				};
			}

			return {
				x: (boxWidth * itemIndex) + (xOffset * itemIndex),
				y: ((rowNumber - 1) * yOffset)
			};
		}
	}

	// Groupings based on the database schema and entities being GQL-only, so switching between the two formats visually aligns somewhat
	const rows = useMemo(() => {
		const relevantTypes = Object.keys(entities);

		// Specify diagram-related types to put them in their own row
		const diagramTypes = relevantTypes.filter(key => {
			return ['venn_diagram', 'network_diagram'].includes(key);
		});

		// Other miscellaneous GQL-only types that will be put in their own row purely for layout purposes
		// TODO: The new array and concat just moves these over to where I happen to know they should do in the diagram,
		//  but this really should do that dynamically somehow
		const miscRowTypes = new Array(2).concat(relevantTypes.filter((key) => {
			return ['providers'].includes(key);
		}));

		// Connection types are types that have foreign keys and are not specified other types
		const connectionTypes = difference(Object.entries(entities).filter(([, items]) => {
			return items.entities.some((table: Table) => table.foreignKeys && Object.keys(table.foreignKeys).length > 0);
		}).map(([key]) => typeFormatToDbTableNameFormat(key)), [...diagramTypes, ...miscRowTypes]);

		// Note: I currently only expect one level of subtypes
		const subtypes = uniq(Object.entries(typeObjects as Record<string, TypeObject>)
			.filter(([key, value]) => relevantTypes.includes(typeFormatToDbTableNameFormat(key)) && value?.isSubtypeOf)
			.map(([key]) => typeFormatToDbTableNameFormat(key))
		);

		// "Root" types = standalone and supertype tables that are connection tables, specified diagram-related types,
		// or specified "bottom row" types for layout purposes
		const nonRootTypes = [...connectionTypes, ...subtypes, ...diagramTypes, ...miscRowTypes];
		const rootTypes = difference(relevantTypes, nonRootTypes).sort((a, b) => a.localeCompare(b));

		// Position the subtypes across the row by aligning the index of the subtype with the index of its supertype
		const sortedSubtypes: string[] = subtypes.reduce((acc, subtype) => {
			const convertedSubtype = dbTableNameFormatToTypeFormat(subtype);

			// Ignore false positives of specified diagram-related types
			if (diagramTypes.includes(convertedSubtype)) {
				return acc;
			}

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

		// Return standalone/supertypes as one row, and subtypes as the next row, followed by diagram-related types
		return [connectionTypes, rootTypes, sortedSubtypes, miscRowTypes, diagramTypes];
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

	const inheritanceLinks: Edge[] = Object.entries(typeObjects as Record<string, TypeObject>)
		.map(([name, typeObject]) => {
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
		})
		.flat(1)
		.filter(edge => edge !== undefined) as Edge[];

	// Additional connections that can't be linked by a specific field (used for GQL-only entities)
	const additionalConnectionPairs = [
		['works', 'providers'],
		['tv_shows', 'providers'],
		['movies', 'providers'],
	];
	const additionalConnections = additionalConnectionPairs.map(([source, target]) => {
		return {
			id: `${source}-${target}`,
			source,
			target,
			label: target === 'providers'
				? `${camelCase(target)} = ${dbTableNameFormatToTypeFormat(target)}[]`
				: `${camelCase(target)} = ${dbTableNameFormatToTypeFormat(target)}`,
			type: 'smoothstep',
		};
	});

	const edges: Edge[] = [...foreignKeyLinks, ...inheritanceLinks, ...additionalConnections];

	return (
		<StyledSchemaDiagramWrapper data-testid="SchemaDiagramWrapper">
			<SchemaDiagram nodes={nodes} edges={edges} />
		</StyledSchemaDiagramWrapper>
	);
};
