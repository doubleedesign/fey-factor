import { FC } from 'react';
import { FinePrint } from '../../typography';
import { Container } from '../../common';
import { StyledFooterTmdbCredit, StyledGlobalFooter } from './GlobalFooter.style';

type GlobalFooterProps = {};

export const GlobalFooter: FC<GlobalFooterProps> = () => {
	return (
		<StyledGlobalFooter data-testid="GlobalFooter">
			<Container>
				<StyledFooterTmdbCredit>
					<img
						src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
						alt="TMDB logo"
						width="50"/>
					<div>
						<FinePrint>
							This product uses the <a href="https://www.themoviedb.org/" target="_blank">TMDB</a> API but is not endorsed or certified by TMDB.
						</FinePrint>
						<FinePrint>Watch provider data provided by JustWatch.</FinePrint>
					</div>
				</StyledFooterTmdbCredit>
			</Container>
		</StyledGlobalFooter>
	);
};
