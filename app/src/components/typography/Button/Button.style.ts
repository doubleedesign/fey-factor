import styled from 'styled-components';
import { ThemeColor } from '../../../types.ts';
import { readableColor, shade } from 'polished';

export const StyledButton = styled.button<{ $appearance: ThemeColor }>`
	background-color: ${props => props.theme.colors[props.$appearance]};
	color: ${props => readableColor(props.theme.colors[props.$appearance])};
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: ${props => props.theme.spacing.xs};
	padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
	cursor: pointer;
	font-size: 1rem;
	font-weight: 600;
	transition: background-color 0.2s ease-in-out;
	
	span {
		text-decoration: underline;
		text-decoration-color: transparent;
		line-height: 1;
	}
	
	i, svg {
		display: inline-block;
		margin-inline-end: ${props => props.theme.spacing.xs};
	}

	&:hover, &:focus, &:active {
		background-color: ${props => shade(0.2, props.theme.colors[props.$appearance])};
		
		span {
			text-decoration-color: currentColor;
		}
	}
`;
