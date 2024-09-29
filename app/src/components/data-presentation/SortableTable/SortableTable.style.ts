import styled from 'styled-components';
import { tint, transparentize } from 'polished';
import { StyledTable } from '../../common.ts';

export const StyledSortableTable = styled(StyledTable)`

	td {
		
		a {
			color: ${props => props.theme.colors.dark};
			text-decoration: underline;
			text-decoration-color: ${props => transparentize(0.5, props.theme.colors.dark)};
			transition: all 0.2s ease-in-out;
			
			&:hover, &:focus, &:active {
				color: ${props => tint(0.2, props.theme.colors.info)};
				text-decoration-color: ${props => props.theme.colors.info};
			}
		}
	}

	thead th {
		
		.react-tooltip {
			max-width: 220px !important;
			font-weight: ${props => props.theme.fontWeights.light};

			&__show {
				opacity: 1;
				z-index: 600;
			}
		}
	}

	tr:nth-child(even) {
		&[data-loaded="true"] {
			background-color: ${props => tint(0.8, props.theme.colors.subtle)};
		}
		
		&[data-loaded="false"] {
			background-color: ${props => tint(0.9, props.theme.colors.subtle)};
		}
	}
	
	tbody td {
		vertical-align: top;
	}
`;
