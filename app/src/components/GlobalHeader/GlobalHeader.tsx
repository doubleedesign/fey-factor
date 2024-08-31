import { FC } from 'react';
import { StyledGlobalHeader, StyledMainMenu, StyledMainMenuList, StyledMainMenuListItem, StyledMainMenuListIconItem } from './GlobalHeader.style';
import { Container } from '../common.ts';
import { Link, NavLink } from 'react-router-dom';
import { Label } from '../Label/Label.tsx';
import { Heading } from '../Heading/Heading.tsx';
import { TooltippedElement } from '../Tooltip/TooltippedElement.tsx';
import { EditionMenu } from '../EditionMenu/EditionMenu.tsx';

type GlobalHeaderProps = {};

export const GlobalHeader: FC<GlobalHeaderProps> = () => {
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
					<EditionMenu />
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
					</StyledMainMenuList>
				</StyledMainMenu>
			</Container>
		</StyledGlobalHeader>
	);
};
