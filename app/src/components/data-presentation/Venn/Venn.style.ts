import styled from 'styled-components';

export const StyledVenn = styled.div`
	background: ${props => props.theme.colors.background};
	border-top-left-radius: ${props => props.theme.spacing.xs};
	border-top-right-radius: ${props => props.theme.spacing.xs};
	width: 100%;
	height: 100%;
	display: flex;
	gap: ${props => props.theme.spacing.sm};

	aside {
		width: 300px;
		flex-basis: 300px;
	}

	figure {
		flex-grow: 1;
	}
`;

export const StyledVennControls = styled.div`
	width: 100%;
	display: flex;
	gap: ${props => props.theme.spacing.sm};
	justify-content: space-between;
	margin-block-end: ${props => props.theme.spacing.sm};
	
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

export const StyledVennFigure = styled.figure`
	margin: 0;
	flex-grow: 1;
	max-width: 100%;
`;