import styled from 'styled-components';

export const StyledToggleField = styled.div`
	width: max-content !important;
	min-width: max-content;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	
	label {
		width: auto;
		display: flex;
		align-items: center;
	}
	
	.react-tooltip {
		width: 10rem;
	}
`;

export const StyledToggle = styled.div<{ $checked: boolean }>`
	border-radius: ${props => props.theme.spacing.md};
	width: ${props => props.theme.spacing.xxl} !important;
	height: ${props => props.theme.spacing.lg};
	margin-inline-start: ${props => props.theme.spacing.xs};
	cursor: pointer;
	position: relative;
	background: ${props => {
		return props.$checked ? props.theme.colors.success : props.theme.colors.subtle;
	}};
	transition: background 0.4s;
	
	input {
		height: 1px;
		width: 1px;
		position: absolute;
		opacity: 0;
	}
	
	&:before {
		content: '';
		height: ${props => props.theme.spacing.lg};
		width: ${props => props.theme.spacing.lg};
		border-radius: 100%;
		border: 2px solid ${props => {
			return props.$checked ? props.theme.colors.success : props.theme.colors.subtle;
		}};
		box-sizing: border-box;
		background: white;
		display: block;
		transition: transform 0.4s, border 0.4s;
		transform: ${props => props.$checked ? 'translateX(100%)' : 'translateX(0)'};
	}
`;