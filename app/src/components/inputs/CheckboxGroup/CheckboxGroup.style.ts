import styled from 'styled-components';

export const StyledCheckboxGroup = styled.fieldset`
	margin: 0;
	margin-block-end: ${props => props.theme.spacing.sm};
	background: ${props => props.theme.colors.background};
	position: relative;
	z-index: 100;
	border-radius: ${props => props.theme.spacing.sm};
	border: 0;
	box-sizing: border-box;
	box-shadow: ${props => `0 0 0.25rem 0 ${props.theme.colors.subtle}`};
	
	legend {
		font-weight: ${props => props.theme.fontWeights.bold};
		background: ${props => props.theme.colors.background};
		padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
		border-top-left-radius: ${props => props.theme.spacing.sm};
		border-top-right-radius: ${props => props.theme.spacing.sm};
	}

	label {
		display: block;
		cursor: pointer;
		
		&:has(input:disabled) {
			cursor: not-allowed;
		}
	}
`;
