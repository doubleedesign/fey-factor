import { FC } from 'react';
import { StyledErrorState } from './ErrorState.style';
import { Button } from '../../../typography';

type ErrorStateProps = {
	error: Error;
	resetErrorBoundary: () => void;
};

export const ErrorState: FC<ErrorStateProps> = ({ error, resetErrorBoundary }) => {
	return (
		<StyledErrorState data-testid="ErrorState">
			<h2 aria-label="Error">
				<i className="fa-solid fa-circle-exclamation"></i>
				Blergh!
			</h2>
			<p>{error.message}</p>
			<Button onClick={resetErrorBoundary} appearance="error">
				<i className="fa-solid fa-rotate-right"></i>
				<span>Try again</span>
			</Button>
		</StyledErrorState>
	);
};
