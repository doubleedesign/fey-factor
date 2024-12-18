import { css } from 'styled-components';
import { ThemeColor } from '../types.ts';
import theme from '../theme.ts';
import { tint } from 'polished';

const hoverTransitionSetup = css`
	position: relative;
	overflow: hidden;
	display: inline-block;
	vertical-align: middle;
	transform: translateZ(0);
	
	&:before {
		content: '';
		position: absolute;
		z-index: -1;
		transition-duration: 0.1s;
		transition-timing-function: ease-out;
	}
`;

export const underlineFromCenter = (color: ThemeColor | 'currentColor', size?: number) => css`
	${hoverTransitionSetup}

	&::before {
		left: 50%;
		right: 50%;
		bottom: 0;
		height: ${size ? size + 'px' : '4px'};
		background-color: ${props => color === 'currentColor' ? 'currentColor' : props.theme.colors[color]};
		transition-property: left, right;
	}

	&:hover,
	&:focus,
	&:active {
		&:before {
			left: 0;
			right: 0;
		}
	}
`;

export const shutterOutVertical = (color: string) => css`
	${hoverTransitionSetup}

	&:before {
		z-index: -1;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: ${color};
		transform: scaleX(0);
		transform-origin: 50%;
		transition-property: transform;
	}

	&:hover,
	&:focus,
	&:active {
		&:before {
			transform: scaleX(1);
		}
	}
`;

export const styledScrollbar = ({
	width = 'auto',
	trackColor = tint(0.4, theme.colors.subtle),
	thumbColor = theme.colors.subtle,
	alwaysVisible = true
} = {}) => {
	if(alwaysVisible) {
		return css`
			scrollbar-width: ${width};
			scrollbar-color: ${thumbColor} ${trackColor};
		`;
	}

	return css`
		scrollbar-width: ${width};
		scrollbar-color: transparent transparent;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		
		&:hover, &:focus-within {
			
			scrollbar-color: ${thumbColor} ${trackColor};
		}
	`;
};
