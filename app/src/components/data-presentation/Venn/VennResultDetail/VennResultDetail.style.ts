import styled, { css } from 'styled-components';
import { StyledLabel } from '../../../typography/Label/Label.style.ts';
import { StyledHeading } from '../../../typography/Heading/Heading.style.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const StyledVennResultDetail = styled.div`
	background: ${props => props.theme.colors.background};
	position: fixed;
	bottom: ${props => props.theme.spacing.sm};
	left: ${props => props.theme.spacing.sm};	
	padding: ${props => props.theme.spacing.sm};
	box-shadow: ${props => `0 0 0.25rem 0 ${props.theme.colors.subtle}`};
	border-radius: ${props => props.theme.spacing.xs};
	width: 24rem;
	
	${StyledLabel} {
		margin: 0;
	}

	${props => breakpointUp(props.theme.breakpoints.xxl, css`
		left: 10rem;
    `)};

	@container venn-container (min-height: 700px) {
		// container has transform: translateX(0) so this will be like absolute positioning
		left: 0; 
		bottom: 0;
	}
`;

export const StyledVennResultDetailHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	
	${StyledHeading} {
		color: ${props => props.theme.colors.primary};
		font-size: ${props => props.theme.fontSizes.lg};
		font-family: ${props => props.theme.fontFamily.body};
		font-weight: ${props => props.theme.fontWeights.bold};
		margin-block: ${props => props.theme.spacing.xs};
	}
`;

export const StyledVennResultDetailBody = styled.div`
	p {
		margin: 0;
		line-height: 1.3;
		
		strong {
			font-weight: ${props => props.theme.fontWeights.bold};
		}
	}
`;
