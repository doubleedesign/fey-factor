import styled from 'styled-components';

export const StyledVenn = styled.div`
	container-name: venn-container;
	container-type: size;
	background: ${props => props.theme.colors.background};
	border-top-left-radius: ${props => props.theme.spacing.xs};
	border-top-right-radius: ${props => props.theme.spacing.xs};
	width: 100%;
	margin: 0;
	flex-grow: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
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

export const StyledVennContent = styled.div`
	container-name: venn-display;
	container-type: size;
	flex-grow: 1;
	margin-block-end: ${props => props.theme.spacing.sm};
	width: 100%;
	transform: translateX(0); // makes fixed-position children behave like they're absolutely positioned
	max-height: 800px;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;

	@container venn-container (min-width: 992px) {
		flex-wrap: nowrap;
	}
`;

export const StyledVennFigure = styled.figure`
	margin: 0;
	flex-grow: 1;
	max-width: 100%;
`;