import { FC } from 'react';
import { StyledEntityTableGroup } from './EntityTableGroup.style';
import { Table } from '../../types.ts';
import { EntityTable } from '../EntityTable/EntityTable.tsx';

type EntityTableGroupProps = {
	entities: Table[];
	format: 'database' | 'graphql';
	id: string;
}

export const EntityTableGroup: FC<EntityTableGroupProps> = ({ entities, format, id }) => {
	return (
		<StyledEntityTableGroup data-testid="EntityTableGroup" data-entity-group-id={id}>
			{entities.map((entity) => (
				<EntityTable key={entity.tableName} table={entity} format={format} />
			))}
		</StyledEntityTableGroup>
	);
};
