import styled from 'styled-components';
import { tint, transparentize } from 'polished';

export const StyledSortableTable = styled.table`
	width: 100%;
	margin-bottom: 1rem;
	border-collapse: collapse;
	border: 1px solid ${props => props.theme.colors.subtle};
	background: ${props => props.theme.colors.background};

	th, td {
		font-family: ${props => props.theme.fontFamily.body};
		text-align: right;
		padding: ${props => props.theme.spacing.sm};
		border-right: 1px solid ${props => tint(0.4, props.theme.colors.subtle)};

		&[data-fieldkey="rank"],
		&[data-fieldkey="id"],
		&[data-fieldkey="title"] {
			text-align: left;
			padding-right: 0.25rem;
		}
		
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
		background-color: ${props => props.theme.colors.secondary};
		border-right-color: ${props => tint(0.3, props.theme.colors.secondary)};
		color: white;
		text-align: left;

		.react-tooltip {
			max-width: 220px !important;
			font-weight: ${props => props.theme.fontWeights.light};

			&__show {
				opacity: 1;
			}
		}
	}

	tr:nth-child(even) {
		background-color: ${props => tint(0.8, props.theme.colors.subtle)};
	}
`;
