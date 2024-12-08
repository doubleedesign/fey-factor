import { ComponentType, FC, PropsWithChildren, ReactNode, Suspense } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary.tsx';
import { StyledRelayComponentWrapper } from './RelayComponentWrapper.style';
import { GenericLoadingState } from '../../states/loading';

type RelayComponentWrapperProps = {
	loadingFallback?: ReactNode;
	errorFallback?: ComponentType<FallbackProps>;
};

export const RelayComponentWrapper: FC<PropsWithChildren<RelayComponentWrapperProps>> = ({ loadingFallback, errorFallback, children }) => {
	return (
		<StyledRelayComponentWrapper data-testid="RelayComponentWrapper">
			<ErrorBoundary fallback={errorFallback}>
				<Suspense fallback={loadingFallback ?? <GenericLoadingState/>}>
					{children}
				</Suspense>
			</ErrorBoundary>
		</StyledRelayComponentWrapper>
	);
};
