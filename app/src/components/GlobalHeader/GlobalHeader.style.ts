import styled from 'styled-components';
import { readableColor, tint } from 'polished';
import { shutterOutVertical } from '../mixins.ts';
import { Container } from '../common.ts';
import { StyledHeading } from '../Heading/Heading.style.ts';
import { typeScale } from '../../theme.ts';
import { StyledLabel } from '../Label/Label.style.ts';

export const StyledGlobalHeader = styled.header`
	background: ${props => props.theme.colors.secondary};
	padding: ${props => props.theme.spacing.md};
	color: ${props => readableColor(props.theme.colors.secondary)};
	
	${Container} {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	${StyledHeading} {
		span:first-of-type {
			font-weight: ${props => props.theme.fontWeights.light};
			font-size: ${props => `calc(${props.theme.fontSizes.xs} / ${typeScale})`};
		}
		
		em {
			display: inline-block;
			padding-inline-end: 2px;
		}
		
		a {
			text-decoration: none;
		}
		
		${StyledLabel} {
			font-size: 0.7rem;
			transform: translateY(-${props => props.theme.spacing.sm});
		}
	}
`;

export const StyledMainMenu = styled.nav`
	display: flex;
	align-items: center;
`;

export const StyledMainMenuList = styled.ul`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	list-style: none;
	padding: 0;
	margin: 0;
`;

export const StyledMainMenuListItem = styled.li`
	display: block;
	margin-inline: 2px;

	a {
		padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
		border-radius: 0.25rem;
		color: ${props => readableColor(props.theme.colors.secondary)};
		font-size: ${props => props.theme.fontSizes.md};
		font-weight: ${props => props.theme.fontWeights.semibold};
		opacity: 0.8;
		transition: opacity 0.2s;
		${props => shutterOutVertical(tint(0.2, props.theme.colors.secondary))};
		text-decoration: underline;
		text-decoration-color: transparent;
		
		&:hover, &:focus, &:active,
		&[aria-current="page"] {
			opacity: 1;
			text-decoration-color: currentColor;
		}

		&[aria-current="page"] {
			background: ${props => tint(0.2, props.theme.colors.secondary)};
		}
	}
`;

export const StyledMainMenuListIconItem = styled.li.attrs({
	role: 'listitem'
})`
	display: flex;
	align-items: center;
	line-height: 1;
	
	svg {
		width: 1.5em;
		height: 1.5em;
	}
	
	a {
		padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xs};
		color: ${props => readableColor(props.theme.colors.secondary)};
		opacity: 0.8;
		transition: opacity 0.2s, color 0.2s;
		display: block;

		&:hover, &:focus, &:active {
			color: ${props => props.theme.colors.accent};
			opacity: 1;
		}
	}
`;