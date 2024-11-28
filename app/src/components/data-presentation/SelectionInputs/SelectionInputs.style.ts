import styled from 'styled-components';
import { readableColor, tint } from 'polished';

export const StyledSelectionInputs = styled.div`
	display: flex;
	flex-wrap: nowrap;
	gap: ${props => props.theme.spacing.xs};
	position: relative;
	z-index: 9000;
	
	label {
		width: 100%;
		
		> div {
			width: 100%;
			
			> div {
				cursor: pointer;
			}
		}
	}
	
	[role="listbox"] {
		border: 1px solid ${props => props.theme.colors.background};
		cursor: pointer;
		
		[role="option"] {
			color: ${props => props.theme.colors.dark};
			cursor: pointer;
			
			&:hover, &:focus {
				background: ${props => tint(0.8, props.theme.colors.success)};
			}
			
			&[aria-selected="true"] {
				background: ${props => props.theme.colors.success};
				color: ${props => readableColor(props.theme.colors.success)};
			}
		}
	}
`;
