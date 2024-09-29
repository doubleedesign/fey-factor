import styled from 'styled-components';
import { tint, transparentize } from 'polished';
import { StyledTooltippedElement } from '../../typography/Tooltip/TooltippedElement.style.ts';

export const StyledExpandableTitle = styled.summary`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-inline-end: ${props => props.theme.spacing.xs};
	// Make it look like a link
	color: ${props => props.theme.colors.dark};
	text-decoration: underline;
	text-decoration-color: ${props => transparentize(0.5, props.theme.colors.dark)};
	transition: all 0.2s ease-in-out;
	cursor: pointer;
	// For the tooltip when there is one
	overflow: visible;

	&:hover, &:focus, &:active {
		color: ${props => tint(0.2, props.theme.colors.info)};
		text-decoration-color: ${props => props.theme.colors.info};
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
	height: calc(1rem * 1.25);
	transition: height 0.2s ease-in-out;
	
	&[open] {
		// the data is currently predictable enough that that fixed height is ok to keep the animation simple
		height: 200px;
		
		${StyledExpandableTitle} { 
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