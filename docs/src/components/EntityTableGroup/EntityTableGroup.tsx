import { FC } from 'react';
import { StyledEntityTableGroup } from './EntityTableGroup.style';
import { Table } from '../../types.ts';
import { EntityTable } from '../EntityTable/EntityTable.tsx';

type EntityTableGroupProps = {
	entities: Table[];
	format: 'database' | 'graphql';
}

export const EntityTableGroup: FC<EntityTableGroupProps> = ({ entities, format }) => {
	return (
		<StyledEntityTableGroup data-testid="EntityTableGroup">
			{entities.map((entity) => (
				<EntityTable key={entity.tableName} table={entity} format={format} />
			))}
		</StyledEntityTableGroup>
	);
};
