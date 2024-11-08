import { FC } from 'react';
import { StyledGlobalFooter } from './GlobalFooter.style';
import { FinePrint } from '../../typography';

type GlobalFooterProps = {};

export const GlobalFooter: FC<GlobalFooterProps> = () => {
	return (
		<StyledGlobalFooter data-testid="GlobalFooter">
			{/* eslint-disable-next-line max-len */}
			<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" alt="TMDB logo" width="250"/>
			<FinePrint>This product uses the TMDB API but is not endorsed or certified by TMDB.</FinePrint>
			<FinePrint>Watch provider data provided by JustWatch.</FinePrint>
		</StyledGlobalFooter>
	);
};
