import { FC, useCallback } from 'react';
import { StyledVennResultListItem } from './VennResultListItem.style.ts';

type VennResultListItemProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	item: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onItemClick?: (item: any) => void;
};

export const VennResultListItem: FC<VennResultListItemProps> = ({ item, onItemClick }: VennResultListItemProps) => {

	const handleClick = useCallback(() => {
		if (onItemClick) {
			onItemClick(item);
		}
	}, [item, onItemClick]);

	return (
		<StyledVennResultListItem onClick={handleClick} value={item}>
			{item.name}
		</StyledVennResultListItem>
	);
};