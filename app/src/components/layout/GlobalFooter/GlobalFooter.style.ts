import styled from 'styled-components';
import { readableColor } from 'polished';
import { FinePrint } from '../../typography';

export const StyledGlobalFooter = styled.footer`
	padding-block: ${props => props.theme.spacing.lg};
	background-color: ${props => props.theme.colors.primary};
	display: flex;
	flex-direction: column;
	align-items: center;
	
	${FinePrint} {
		color: ${props => readableColor(props.theme.colors.primary)};
		margin-block-start: ${props => props.theme.spacing.sm};
	}
`;
