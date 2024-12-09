import styled from 'styled-components';

export const StyledVenn = styled.div`
	background: ${props => props.theme.colors.background};
	border-top-left-radius: ${props => props.theme.spacing.xs};
	border-top-right-radius: ${props => props.theme.spacing.xs};
	width: 100%;
	margin: 0;
	flex-grow: 1;
	position: relative;
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

export const StyledVennWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	margin-block-end: ${props => props.theme.spacing.sm};
`;

export const StyledVennFigure = styled.figure`
	margin: 0;
	flex-grow: 1;
	padding: ${props => props.theme.spacing.sm};
	box-sizing: border-box;
	transform: translateY(-2rem);
`;