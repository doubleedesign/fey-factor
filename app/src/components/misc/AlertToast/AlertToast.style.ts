import styled from 'styled-components';
import { tint } from 'polished';

export const StyledAlertToast = styled.div`
	position: fixed;
	bottom: ${props => props.theme.spacing.md};
	right: ${props => props.theme.spacing.md};
	padding: ${props => props.theme.spacing.md};
	background: ${props => tint(0.8, props.theme.colors.warning)};
	border: 1px solid ${props => props.theme.colors.warning};
	z-index: 9999;
	width: 20rem;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	
	p {
		margin: 0;
	}
`;
