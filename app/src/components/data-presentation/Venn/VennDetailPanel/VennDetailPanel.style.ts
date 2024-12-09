import styled from 'styled-components';
import { StyledHeading } from '../../../typography/Heading/Heading.style.ts';
import { tint } from 'polished';

export const StyledVennDetailPanel = styled.aside`
	min-width: 20rem;
	flex-basis: 20rem;
	padding: ${props => props.theme.spacing.sm};
	box-sizing: border-box;
	background: ${props => tint(0.8, props.theme.colors.subtle)};
	border-radius: ${props => props.theme.spacing.xs};
	transform: translateX(-${props => props.theme.spacing.sm});

	${StyledHeading} {
		margin-block-end: ${props => props.theme.spacing.sm};
	}
	
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

		> div:has(fieldset) {
			padding-bottom: 1rem;
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
