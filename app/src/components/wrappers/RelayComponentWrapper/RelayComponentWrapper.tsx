import { ComponentType, FC, PropsWithChildren, ReactNode, Suspense } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary.tsx';
import { StyledRelayComponentWrapper } from './RelayComponentWrapper.style';

type RelayComponentWrapperProps = {
	loadingFallback?: ReactNode;
	errorFallback?: ComponentType<FallbackProps>;
};

export const RelayComponentWrapper: FC<PropsWithChildren<RelayComponentWrapperProps>> = ({ loadingFallback, errorFallback, children }) => {
	return (
		<StyledRelayComponentWrapper data-testid="RelayComponentWrapper">
			<ErrorBoundary fallback={errorFallback}>
				<Suspense fallback={loadingFallback ?? <div>Loading...</div>}>
					{children}
				</Suspense>
			</ErrorBoundary>
		</StyledRelayComponentWrapper>
	);
};
