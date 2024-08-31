import { FC, PropsWithChildren } from 'react';
import { StyledPageWrapper } from './PageWrapper.style';
import { Container } from '../common.ts';

type PageWrapperProps = {};

export const PageWrapper: FC<PropsWithChildren<PageWrapperProps>> = ({ children }) => {
	return (
		<StyledPageWrapper data-testid="PageWrapper">
			<Container>
				{children}
			</Container>
		</StyledPageWrapper>
	);
};
