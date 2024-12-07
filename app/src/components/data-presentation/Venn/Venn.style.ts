import styled from 'styled-components';
import { tint } from 'polished';

export const StyledVenn = styled.div`
	background: ${props => props.theme.colors.background};
	width: 100%;
	margin: 0;
	flex-grow: 1;
`;

export const StyledVennControls = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	padding: ${props => props.theme.spacing.sm};
	box-sizing: border-box;
	
	> div {
		z-index: 7000;
	}
	
	div:has(label):has([role="combobox"]) {
		width: max-content;
		
		label {
			display: flex;
			align-items: center;
			
			span {
				padding: 0;
				white-space: nowrap;
			}
		}
		
		i, svg {
			margin-inline-end: ${props => props.theme.spacing.xs};
		}
		
		> div {
			width: auto;
		}
		
		div:has([role="combobox"]) {
			cursor: pointer;
		}
	}
`;

export const StyledVennWrapper = styled.figure`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const StyledEulerVennWrapper = styled.div`
	transform: translateY(-${props => props.theme.spacing.xl});
	overflow: visible;
	
	small {
		display: block;
		margin-block-start: ${props => props.theme.spacing.lg};
		text-align: center;
	}
`;
