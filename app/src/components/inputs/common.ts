import styled from 'styled-components';

export const StyledSelectLabel = styled.span`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	position: relative;
	z-index: 900;

	i, svg {
		display: inline-block;
		margin-inline-start: ${props => props.theme.spacing.xs};
	}

	.react-tooltip {
		z-index: 1200;
		max-width: 8rem;
	}
`;

export const StyledFieldset = styled.fieldset`
	margin: 0;
	background: ${props => props.theme.colors.background};
	position: relative;
	z-index: 100;
	border-radius: ${props => props.theme.spacing.sm};
	padding: ${props => props.theme.spacing.sm} 0;
	border: 0;
	box-sizing: border-box;
	
	legend {
		font-weight: ${props => props.theme.fontWeights.bold};
		background: ${props => props.theme.colors.background};
		padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
		border-top-left-radius: ${props => props.theme.spacing.sm};
		border-top-right-radius: ${props => props.theme.spacing.sm};

		details & {
			visibility: hidden;
			position: absolute;
		}
	}

	label {
		display: block;
		cursor: pointer;
		
		&:has(input:disabled) {
			cursor: not-allowed;
		}
		
		input[type="checkbox"],
		input[type="radio"] {
			margin-inline-start: 0;
		}
	}
`;
