import { FC } from 'react';
import { StyledSortingButton } from './SortingButton.style';

type SortingButtonProps = {
	label: string;
	direction: 'asc' | 'desc';
	onClick: (e) => void;
	active: boolean;
};

export const SortingButton: FC<SortingButtonProps> = ({ label, direction, onClick, active = false }) => {
	return (
		<StyledSortingButton data-testid="SortingButton" onClick={onClick} $direction={direction} $active={active}>
			{label}
			<i className="fa-solid fa-chevron-up"></i>
		</StyledSortingButton>
	);
};