import styled from 'styled-components';
import { readableColor } from 'polished';

export const StyledLabel = styled.span<{ type: 'info' | 'warning' | 'success' | 'error' | 'accent' }>`
	display: inline-block;
	margin: 0 ${props => props.theme.spacing.sm};
	border-radius: 0.25rem;
	background: ${props => props.theme.colors[props.type]};
	color: ${props => readableColor(props.theme.colors[props.type])};
	font-family: ${props => props.theme.fontFamily.body};
	font-size: 0.7rem;
	padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing['sm-md']};
	line-height: 0.8;
	text-transform: uppercase;
	font-weight: ${props => props.theme.fontWeights.semibold};
`;
