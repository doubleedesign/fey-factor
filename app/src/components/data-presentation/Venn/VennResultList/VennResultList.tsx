import { FC, useCallback, MouseEvent } from 'react';
import { StyledVennResultList } from './VennResultList.style';

type VennResultListProps = {
	label: string;
	data: any[];
	onItemClick?: (item: any) => void;
};

type VennResultListItemProps = {
	item: any;
	onItemClick?: (item: any) => void;
};

const VennResultListItem: FC<VennResultListItemProps> = ({ item, onItemClick }: VennResultListItemProps) => {
	const handleClick = useCallback((event) => {
		if (onItemClick) {
			console.debug(item);
			onItemClick(item);
		}
	}, [item, onItemClick]);

	return (
		<li>
			<button onClick={handleClick} value={item}>{item.name}</button>
		</li>
	);
};

export const VennResultList: FC<VennResultListProps> = ({ data, onItemClick }) => {
	console.log(data);

	return (
		<StyledVennResultList data-testid="VennResultList">
			<ul>
				{data.map((item, index) => (
					<VennResultListItem key={index} item={item} onItemClick={onItemClick} />
				))}
			</ul>
		</StyledVennResultList>
	);
};
