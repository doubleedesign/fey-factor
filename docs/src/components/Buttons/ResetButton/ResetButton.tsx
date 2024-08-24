import { FC } from 'react';
import { StyledResetButton } from './ResetButton.style';

type SwapButtonProps = {
	onClick: () => void;
}

export const ResetButton: FC<SwapButtonProps> = ({ onClick }) => {

	return (
		<StyledResetButton data-testid="SwapButton" onClick={onClick}>
			Reset layout <i className="fa-regular fa-arrows-rotate"></i>
		</StyledResetButton>
	);
};
