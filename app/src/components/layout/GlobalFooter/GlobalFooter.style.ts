import styled, { css } from 'styled-components';
import { readableColor } from 'polished';
import { FinePrint } from '../../typography';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const StyledGlobalFooter = styled.footer`
	padding-block: ${props => props.theme.spacing.lg};
	background-color: ${props => props.theme.colors.primary};
	display: flex;
	flex-direction: column;
	align-items: center;

	${props => breakpointUp(props.theme.breakpoints.lg, css`
		justify-content: space-between;
	`)};
	
	${FinePrint} {
		color: ${props => readableColor(props.theme.colors.primary)};
		
		a {
			color: ${props => readableColor(props.theme.colors.primary)};
			text-decoration: underline;
			transition: color 0.2s ease-in-out;
			
			&:hover, &:focus, &:active {
				color: ${props => props.theme.colors.accent};
			}
		}
	}
`;

export const StyledFooterTmdbCredit = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${props => props.theme.spacing.sm};

	${props => breakpointUp(props.theme.breakpoints.lg, css`
		justify-content: flex-start;
	`)};
`;
