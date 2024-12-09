import styled, { css } from 'styled-components';
import { readableColor, shade, tint } from 'polished';
import { shutterOutVertical } from '../../mixins.ts';
import { Container } from '../../common.ts';
import { typeScale } from '../../../theme.ts';
import { StyledHeading } from '../../typography/Heading/Heading.style';
import { StyledLabel } from '../../typography/Label/Label.style';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const StyledGlobalHeader = styled.header`
	background: ${props => shade(0.2, props.theme.colors.primary)};
	color: ${props => readableColor(props.theme.colors.primary)};
	z-index: 9990;
	position: relative;
	
	${Container} {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		height: auto;
		
		${props => breakpointUp(props.theme.breakpoints.md, css`
			justify-content: space-between;
	        flex-wrap: nowrap;
			height: 100%;
	    `)};

		${props => breakpointUp(props.theme.breakpoints.lg, css`
			padding-inline-end: 2.25rem; // hacky fix for the button-related layout shift
		`)};
	}
	
	${StyledHeading} {
		width: 100%;
		flex-basis: 100%;
		justify-content: center;
		padding-bottom: ${props => props.theme.spacing.sm};
		border-bottom: 1px solid ${props => tint(0.2, props.theme.colors.primary)};
		margin-bottom: ${props => props.theme.spacing.sm};

		${props => breakpointUp(props.theme.breakpoints.md, css`
            width: auto;
			flex-basis: auto;
			padding-bottom: 0;
			border-bottom: 0;
			margin-bottom: 0;
        `)};
		
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

export const StyledGlobalHeaderToggleWrapper = styled(Container)`
	padding: 0 !important;
	transform: translate(-0.5rem, -0.5rem);
`;

export const StyledGlobalHeaderToggleButton = styled.button`
	cursor: pointer;
	background: ${props => shade(0.6, props.theme.colors.primary)};
	color: ${props => readableColor(props.theme.colors.primary)};
	border: 0;
	appearance: none;
	padding: ${props => props.theme.spacing.sm};
	padding-top: ${props => props.theme.spacing.lg};
	border-radius: ${props => props.theme.spacing.sm};
	transition: color 0.2s ease-in-out;
	margin-block-end: -4rem;
	margin-block-start: -0.5rem;
	position: absolute;
	top: 0;
	left: ${props => props.theme.spacing.sm};
	
	svg {
		width: 1.5rem;
		height: 1.5rem;
	}
	
	&:hover, &:focus, &:active {
		color: ${props => props.theme.colors.accent};
	}

	${props => breakpointUp(props.theme.breakpoints.lg, css`
		position: relative;
	`)};
`;

export const StyledGlobalHeaderContent = styled.div<{ $height: number }>`
	overflow: ${props => props.$height === 0 ? 'hidden' : 'visible'};
	transition: all 0.2s ease-in-out;
	will-change: height;
	height: ${props => props.$height}px;
	min-height: ${props => props.$height > 0 ? '3rem' : 0};
	
	${props => breakpointUp(props.theme.breakpoints.lg, css`
		padding-inline-start: 5rem;
	`)};
`;

export const StyledMainMenu = styled.nav`
	display: flex;
	align-items: center;
`;

export const StyledMainMenuList = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	list-style: none;
	padding: 0;
	margin: 0;

	${props => breakpointUp(props.theme.breakpoints.md, css`
		justify-content: flex-end;
        flex-wrap: nowrap;
		margin: 0;
    `)};
`;

export const StyledMainMenuListItem = styled.li`
	display: block;
	margin-inline: 2px;
	margin-block: ${props => props.theme.spacing.sm};

	${props => breakpointUp(props.theme.breakpoints.md, css`
		margin-block: 0;
    `)};

	a {
		padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm};
		border-radius: 0.25rem;
		color: ${props => readableColor(props.theme.colors.primary)};
		font-size: ${props => props.theme.fontSizes.md};
		font-weight: ${props => props.theme.fontWeights.semibold};
		opacity: 0.8;
		transition: opacity 0.2s;
		${props => shutterOutVertical(tint(0.2, props.theme.colors.primary))};
		text-decoration: underline;
		text-decoration-color: transparent;

		${props => breakpointUp(props.theme.breakpoints.md, css`
			padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
	    `)};
		
		&:hover, &:focus, &:active,
		&[aria-current="page"] {
			opacity: 1;
			text-decoration-color: currentColor;
		}

		&[aria-current="page"] {
			color: ${props => props.theme.colors.accent};
		}
	}
`;

export const StyledMainMenuListIconItem = styled.li`
	display: flex;
	align-items: center;
	line-height: 1;
	
	svg {
		width: 1.5em;
		height: 1.5em;
	}
	
	a {
		padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xs};
		color: ${props => readableColor(props.theme.colors.primary)};
		opacity: 0.8;
		transition: opacity 0.2s, color 0.2s;
		display: block;

		&:hover, &:focus, &:active {
			color: ${props => props.theme.colors.accent};
			opacity: 1;
		}
	}
`;