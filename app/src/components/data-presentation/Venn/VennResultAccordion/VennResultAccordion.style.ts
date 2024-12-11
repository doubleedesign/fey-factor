import styled from 'styled-components';

export const StyledVennResultAccordion = styled.div`
	details {
		background: ${props => props.theme.colors.background};

		&:last-of-type {
			margin-block-end: ${props => props.theme.spacing.sm};
		}

		summary {
			font-weight: ${props => props.theme.fontWeights.bold};
		}
		
		&[open] {
			summary span {
				color: ${props => props.theme.colors.secondary};
				text-decoration-color: ${props => props.theme.colors.secondary} !important;
			}
		}
	}
`;