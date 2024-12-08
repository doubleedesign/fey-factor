import styled from 'styled-components';

export const StyledVennDetailPanel = styled.aside`
	min-width: 20rem;
	flex-basis: 20rem;
	padding: ${props => props.theme.spacing.sm};
	box-sizing: border-box;
	
	details {
		margin-block-end: ${props => props.theme.spacing.sm};
		border-radius: ${props => props.theme.spacing.xs};
		box-shadow: 0 0 0.25rem 0 ${props => props.theme.colors.subtle};
		padding: ${props => props.theme.spacing.sm};
		overflow: hidden;
		
		&:last-of-type {
			margin-block-end: ${props => props.theme.spacing.lg};
		}
		
		summary {
			cursor: pointer;
			font-weight: ${props => props.theme.fontWeights.bold};
		}
		
		&[open] {
			summary span {
				color: ${props => props.theme.colors.secondary};
				text-decoration-color: ${props => props.theme.colors.secondary} !important;
			}
		}
	}
	
	small {
		display: flex;
		flex-wrap: nowrap;
		line-height: 1.125;
		
		i, svg {
			margin-inline-end: ${props => props.theme.spacing.xs};
		}
	}
`;
