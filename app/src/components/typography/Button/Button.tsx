import { FC, PropsWithChildren } from 'react';
import { ThemeColor } from '../../../types.ts';
import { StyledButton } from './Button.style';

type ButtonProps = {
	onClick?: () => void;
	appearance?: ThemeColor;
};

export const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, appearance, children }) => {
	return (
		<StyledButton onClick={onClick} data-testid="Button" $appearance={appearance ?? 'primary'}>
			{children}
		</StyledButton>
	);
};
