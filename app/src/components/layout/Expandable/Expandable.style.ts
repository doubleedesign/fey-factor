import styled from 'styled-components';
import { tint, transparentize } from 'polished';
import { StyledTooltippedElement } from '../../typography/Tooltip/TooltippedElement.style.ts';

export const StyledExpandableTitle = styled.summary`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-inline-end: ${props => props.theme.spacing.xs};
	cursor: pointer;
	// For the tooltip when there is one
	overflow: visible;
	
	> span {
		height: 100%;
		display: flex;
		align-items: center;
		color: ${props => props.theme.colors.dark};
		text-decoration: underline;
		text-decoration-color: ${props => transparentize(0.5, props.theme.colors.dark)};
		transition: all 0.2s ease-in-out;
	}

	&:hover, &:focus, &:active {
		> span {
			color: ${props => tint(0.2, props.theme.colors.info)};
			text-decoration-color: ${props => props.theme.colors.info};
		}
	}
	
	&::marker,
	::-webkit-details-marker {
		content: '';
	}
	
	svg {
		font-size: 0.8em;
		position: relative;
		transition: transform 0.2s ease-in-out;
		transform-origin: center;
	}

	${StyledTooltippedElement} {
		position: relative;
		z-index: 700;

		.react-tooltip {
			z-index: 1200;
		}
	}	
`;


export const StyledExpandable = styled.details`
	line-height: 1.25;
	display: grid;
	grid-template-rows: 0fr;
	min-height: 0;
	transition: grid-template-rows 0.2s ease-out, min-height 0.2s ease-in-out;
	
	&[open] {
		grid-template-rows: 1fr;
		min-height: 200px;
		
		${StyledExpandableTitle} {
			margin-block-end: ${props => props.theme.spacing.sm};
			
			> span {
				font-weight: ${props => props.theme.fontWeights.bold};
				color: ${props => props.theme.colors.info};
				text-decoration-color: ${props => props.theme.colors.info};
			}
			
			svg {
				transform: rotate(45deg);
			}
		}
	}
	
	&:has(.react-tooltip) {
		> ${StyledExpandableTitle} {
			position: relative;
			z-index: 1200;
		}
	}
`;