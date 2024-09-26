import styled from 'styled-components';
import { readableColor, tint } from 'polished';

export const StyledNumberPicker = styled.div`
	min-width: 12rem;
	
	label {
		width: 100%;
		display: flex;
		align-items: center;
		
		span {
			display: inline-block;
			margin-inline-end: 0.5rem;
		}
		
		> div {
			flex-grow: 1;
			
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
