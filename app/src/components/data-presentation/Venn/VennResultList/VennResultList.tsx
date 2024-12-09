import { FC } from 'react';
import { StyledVennResultList } from './VennResultList.style';
import snakeCase from 'lodash/snakeCase';
import { VennResultListItem } from '../VennResultListItem/VennResultListItem.tsx';

type VennResultListProps = {
	label: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onItemClick?: (item: any) => void;
};

export const VennResultList: FC<VennResultListProps> = ({ data, onItemClick }) => {

	return (
		<StyledVennResultList data-testid="VennResultList">
			{data.map((item, index) => (
				<VennResultListItem key={index} item={item} onItemClick={onItemClick} />
			))}
		</StyledVennResultList>
	);
};
