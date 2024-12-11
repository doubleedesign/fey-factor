import styled, { css } from 'styled-components';
import { tint, transparentize } from 'polished';
import { StyledTooltippedElement } from '../../typography/Tooltip/TooltippedElement.style.ts';
import { styledScrollbar } from '../../mixins.ts';

export const StyledExpandableTitle = styled.summary`
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	overflow: visible; // For the tooltip when there is one
	margin: 0;

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

export const StyledExpandable = styled.details<{ $height?: number, $appearance: 'default' | 'shadow' }>`
	line-height: 1.25;
	transition: all 0.3s ease-in-out;
	will-change: height, max-height;
	padding: ${props => props.$appearance === 'shadow' ? props.theme.spacing.sm : 0};
	height: ${props => `${props.$height}px`};
	max-height: ${props => `${props.$height}px`};
	overflow: hidden;
	box-sizing: border-box;
	border-radius: ${props => props.$appearance === 'shadow' ? props.theme.spacing.xs : 0};
	box-shadow: ${props => props.$appearance === 'shadow' ? `0 0 0.25rem 0 ${props.theme.colors.subtle}` : 'none'};
	margin-block-end: ${props => props.$appearance === 'shadow' ? props.theme.spacing.sm : 0};
	position: relative;
	z-index: 600;


	&[open] {
		${StyledExpandableTitle} {
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

export const StyledExpandableContent = styled.div<{ $height: number | 'auto', $scrollable?: boolean, $maxHeight?: number }>`
	height: ${props => props.$height === 'auto' ? 'auto' : `${props.$height}px`};
	${({ $scrollable, $maxHeight, theme }) => {
		return $scrollable && css`
				overflow-y: auto;
				${$maxHeight && `max-height: ${$maxHeight}px`};
				${styledScrollbar({
					trackColor: theme.colors.background,
					alwaysVisible: false
				})}
			`;
	}}
`;