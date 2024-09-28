import React, { FC } from 'react';
import { StyledSortingButton } from './SortingButton.style';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { SingleLineText } from '../../typography/SingleLineText/SingleLineText.tsx';

type SortingButtonProps = {
	label: string;
	direction: 'asc' | 'desc';
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	active: boolean;
	tooltip?: string;
};

export const SortingButton: FC<SortingButtonProps> = ({ label, direction, onClick, tooltip, active = false }) => {
	return (
		<>
			<StyledSortingButton
				data-testid="SortingButton"
				data-tooltip-id={`${label}-tooltip`} data-tooltip-content={tooltip}
				onClick={onClick} $direction={direction} $active={active}
			>
				<SingleLineText text={label} />
				<i className="fa-sharp-duotone fa-solid fa-sort"></i>
			</StyledSortingButton>
			<Tooltip id={`${label}-tooltip`} place="bottom" />
		</>
	);
};
