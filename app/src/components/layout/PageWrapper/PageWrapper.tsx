import { FC, PropsWithChildren } from 'react';
import { StyledPageWrapper } from './PageWrapper.style';
import { Container } from '../../common.ts';

type PageWrapperProps = {
	fullwidth?: boolean;
};

export const PageWrapper: FC<PropsWithChildren<PageWrapperProps>> = ({ fullwidth, children }) => {
	return (
		<StyledPageWrapper data-testid="PageWrapper">
			{fullwidth ? (
				<>{children}</>
			) : (
				<Container>
					{children}
				</Container>
			)}
		</StyledPageWrapper>
	);
};
