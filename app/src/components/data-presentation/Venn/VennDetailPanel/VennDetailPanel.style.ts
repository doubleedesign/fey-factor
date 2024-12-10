import styled from 'styled-components';
import { tint } from 'polished';

export const StyledVennDetailPanel = styled.aside`
	padding: ${props => props.theme.spacing.sm};
	box-sizing: border-box;
	background: ${props => tint(0.8, props.theme.colors.subtle)};
	border-radius: ${props => props.theme.spacing.xs};
`;
