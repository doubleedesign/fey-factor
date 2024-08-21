import { FC, useState } from 'react';
import { StyledSwapButton } from './SwapButton.style';

type SwapButtonProps = {
	onClick: () => void;
}

export const SwapButton: FC<SwapButtonProps> = ({ onClick }) => {
	const [flipped, setFlipped] = useState(false);

	const handleClick = () => {
		setFlipped(!flipped);
		onClick();
	};

	return (
		<StyledSwapButton data-testid="SwapButton" onClick={handleClick} className={flipped ? 'flipped' : ''}>
			Swap <i className="fa-solid fa-right-left"></i>
		</StyledSwapButton>
	);
};
