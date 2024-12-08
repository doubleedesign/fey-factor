import styled from 'styled-components';

export const StyledCheckboxGroup = styled.fieldset`
	margin-block-end: ${props => props.theme.spacing.sm};
	background: ${props => props.theme.colors.background};
	position: relative;
	z-index: 100;
	border-radius: ${props => props.theme.spacing.sm};
	border: 1px solid ${props => props.theme.colors.subtle};
	
	legend {
		font-weight: ${props => props.theme.fontWeights.bold};
	}

	label {
		display: block;
		cursor: pointer;
		
		&:has(input:disabled) {
			cursor: not-allowed;
		}
	}
`;
