import { FC } from 'react';
import { StyledLoadingScreen } from './LoadingScreen.style';

type LoadingScreenProps = {}

export const LoadingScreen: FC<LoadingScreenProps> = () => {
	return (
		<StyledLoadingScreen data-testid="LoadingScreen">
			LoadingScreen Component
		</StyledLoadingScreen>
	);
};
