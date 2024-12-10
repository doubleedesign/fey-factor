import styled from 'styled-components';
import { readableColor, tint } from 'polished';

export const StyledSelectionInputs = styled.div`
	display: flex;
	flex-wrap: nowrap;
	gap: ${props => props.theme.spacing.sm};
	position: relative;
	z-index: 9000;
	
	> span {
		display: flex;
		align-items: center;
		padding-inline-end: ${props => props.theme.spacing.xs};
		transform: translateY(0.5rem);
	}
	
	label {
		width: 100%;
		
		> span {
			display: block;
			padding-block-end: ${props => props.theme.spacing.xs};
		}
		
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
			
			&:has([type="checkbox"]) {
				img {
					filter: saturate(0);
					opacity: 0.5;
				}
				
				&:hover, &:focus {
					img {
						opacity: 1;
					}
				}

				&[aria-selected="true"] {
					background: white;
					color: black;
					
					img {
						filter: none;
						opacity: 1;
					}
				}
			}
		}
	}
`;
