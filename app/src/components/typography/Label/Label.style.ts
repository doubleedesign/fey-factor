import styled from 'styled-components';
import { readableColor, tint } from 'polished';

export const StyledLabel = styled.span<{ type: 'info' | 'warning' | 'success' | 'error' | 'accent' | 'subtle' | 'subtler' }>`
	display: inline-block;
	margin: 0 ${props => props.theme.spacing.sm};
	border-radius: 0.25rem;
	background: ${props => {
		if(props.type === 'subtler') {
			return tint(0.5, props.theme.colors.subtle);
		}

		return props.theme.colors[props.type];
	}};
	color: ${props => {
		if(props.type === 'subtler') {
			return readableColor(tint(0.4, props.theme.colors.subtle));
		}

		return readableColor(props.theme.colors[props.type]);
	}};
	font-family: ${props => props.theme.fontFamily.body};
	font-size: 0.7rem;
	padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing['sm-md']};
	line-height: 0.8;
	text-transform: uppercase;
	font-weight: ${props => props.theme.fontWeights.semibold};
`;
