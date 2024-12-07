import { ComponentType, FC, PropsWithChildren } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { StyledErrorBoundary } from './ErrorBoundary.style';
import { ErrorState } from '../../states/error/ErrorState/ErrorState.tsx';

type ErrorBoundaryProps = {
	fallback?: ComponentType<FallbackProps>;
};

export const ErrorBoundary: FC<PropsWithChildren<ErrorBoundaryProps>> = ({ fallback, children }) => {
	return (
		<StyledErrorBoundary data-testid="ErrorBoundary">
			<ReactErrorBoundary FallbackComponent={fallback ?? ErrorState}>
				{children}
			</ReactErrorBoundary>
		</StyledErrorBoundary>
	);
};