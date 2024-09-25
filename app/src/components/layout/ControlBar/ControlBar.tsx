import { FC, PropsWithChildren } from 'react';
import { StyledControlBar } from './ControlBar.style';

type ControlBarProps = {};

export const ControlBar: FC<PropsWithChildren<ControlBarProps>> = ({ children }) => {
	return (
		<StyledControlBar data-testid="ControlBar">
			{children}
		</StyledControlBar>
	);
};
