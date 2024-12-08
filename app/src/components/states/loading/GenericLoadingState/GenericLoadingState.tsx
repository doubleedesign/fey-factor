import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import { StyledGenericLoadingState } from './GenericLoadingState.style';

type GenericLoadingStateProps = {};

export const GenericLoadingState: FC<GenericLoadingStateProps> = () => {
	return (
		<StyledGenericLoadingState data-testid="GenericLoadingState">
			<Skeleton />
			<p>Loading &hellip;</p>
		</StyledGenericLoadingState>
	);
};
