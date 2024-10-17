import { FC } from 'react';
import { StyledGlobalHeader, StyledMainMenu, StyledMainMenuList, StyledMainMenuListItem, StyledMainMenuListIconItem } from './GlobalHeader.style';
import { Link, NavLink } from 'react-router-dom';
import { Container } from '../../common.ts';
import { Heading, Label, TooltippedElement } from '../../typography';
import { EditionMenu } from '../../misc/EditionMenu/EditionMenu';
import { useRankingContext } from '../../../controllers/RankingContext.tsx';

type GlobalHeaderProps = {};

export const GlobalHeader: FC<GlobalHeaderProps> = () => {
	const { degreeZero } = useRankingContext();

	return (
		<StyledGlobalHeader data-testid="GlobalHeader">
			<Container>
				<Heading level="h1">
					<Link to={'/'}>
						<span className="above-heading">The</span>
						<em>Fey</em> Factor
						<Label type="accent" text="Beta"/>
					</Link>
				</Heading>
				<StyledMainMenu>
					<StyledMainMenuList>
						<StyledMainMenuListItem><NavLink to={'/rankings'}>Rankings</NavLink></StyledMainMenuListItem>
						<StyledMainMenuListItem><NavLink to={'/network'}>Network</NavLink></StyledMainMenuListItem>
						<StyledMainMenuListItem><NavLink to={'/venn-diagram'}>Venn Diagram</NavLink></StyledMainMenuListItem>
						<StyledMainMenuListIconItem>
							<TooltippedElement id="about-tooltip" tooltip="About">
								<NavLink to={'/about'} aria-label="About">
									<i className="fa-sharp fa-solid fa-circle-info"></i>
								</NavLink>
							</TooltippedElement>
						</StyledMainMenuListIconItem>
						<StyledMainMenuListIconItem>
							<TooltippedElement id="github-tooltip" tooltip="View project on GitHub">
								<a aria-label="View project on GitHub" href="https://github.com/doubleedesign/fey-factor" target="_blank">
									<i className="fa-brands fa-github"></i>
								</a>
							</TooltippedElement>
						</StyledMainMenuListIconItem>
						<li>
							<EditionMenu selected={degreeZero}/>
						</li>
					</StyledMainMenuList>
				</StyledMainMenu>
			</Container>
		</StyledGlobalHeader>
	);
};
