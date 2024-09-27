import { FC, PropsWithChildren } from 'react';
import { StyledControlBar } from './ControlBar.style';
import { Container } from '../../common.ts';

type ControlBarProps = {
	withContainer?: boolean; // quick workaround for dealing with fullwidth PageWrapper
};

export const ControlBar: FC<PropsWithChildren<ControlBarProps>> = ({ withContainer, children }) => {
	return (
		<StyledControlBar data-testid="ControlBar">
			{withContainer ? (
				<Container as="div">
					{children}
				</Container>
			) : (
				<>{children}</>
			)}
		</StyledControlBar>
	);
};
