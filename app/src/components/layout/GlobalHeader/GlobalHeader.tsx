import { FC, useRef, useState } from 'react';
import {
	StyledGlobalHeader,
	StyledMainMenu,
	StyledMainMenuList,
	StyledMainMenuListItem,
	StyledMainMenuListIconItem,
	StyledGlobalHeaderToggleWrapper,
	StyledGlobalHeaderToggleButton,
	StyledGlobalHeaderContent,
} from './GlobalHeader.style';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container } from '../../common.ts';
import { Heading, Label, TooltippedElement } from '../../typography';
import { EditionMenu } from '../../misc/EditionMenu/EditionMenu';
import { useRankingContext } from '../../../controllers/RankingContext.tsx';
import { useResizeObserver } from '../../../hooks';

type GlobalHeaderProps = {};

export const GlobalHeader: FC<GlobalHeaderProps> = () => {
	const { degreeZero } = useRankingContext();
	const { pathname } = useLocation();
	const [isOpen, setIsOpen] = useState<boolean>(pathname === '/');
	const ref = useRef<HTMLDivElement>(null);
	const { height: contentHeight } = useResizeObserver(ref, [isOpen]);

	return (
		<StyledGlobalHeader data-testid="GlobalHeader">
			<StyledGlobalHeaderToggleWrapper as="div">
				<StyledGlobalHeaderToggleButton onClick={() => setIsOpen(!isOpen)} aria-label="Toggle app menu">
					<TooltippedElement id="main-menu-toggle" tooltip={isOpen ? 'Close main menu' : 'Open main menu'} position="right">
						<i className="fa-solid fa-bars"></i>
					</TooltippedElement>
				</StyledGlobalHeaderToggleButton>
			</StyledGlobalHeaderToggleWrapper>
			<StyledGlobalHeaderContent $height={isOpen ? contentHeight : 0}>
				<Container as="div" ref={ref}>
					<Heading level="h1">
						<Link to={'/'}>
							<span className="above-heading">The</span>
							<em>Fey</em> Factor&nbsp;
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
			</StyledGlobalHeaderContent>
		</StyledGlobalHeader>
	);
};
