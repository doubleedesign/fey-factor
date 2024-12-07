import styled from 'styled-components';
import { tint } from 'polished';

export const StyledErrorState = styled.div`
	background: ${props => tint(0.9, props.theme.colors.error)};
	border: 1px solid ${props => props.theme.colors.error};
	padding: ${props => props.theme.spacing.md};
	text-align: center;
	
	h2 {
		color: ${props => props.theme.colors.error};
		font-weight: ${props => props.theme.fontWeights.bold};
		margin-block-end: ${props => props.theme.spacing.md};
		
		i, svg {
			margin-inline-end: ${props => props.theme.spacing.sm};
		}
	}
	
	p {
		margin: ${props => props.theme.spacing.sm} 0;
	}
	
	button {
		margin-block-start: ${props => props.theme.spacing.md};
	}
`;
