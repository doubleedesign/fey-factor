import styled from 'styled-components';

export const StyledBarChart = styled.figure`
	width: 100%;
	margin: 0;
	background: ${props => props.theme.colors.background};
	padding: ${props => props.theme.spacing.lg};
	border: 1px solid ${props => props.theme.colors.subtle};
	box-sizing: border-box;
	
	[role="list"] {
		
		[role="listitem"] {
			display: grid;
			grid-template-areas: unset;
			grid-template-columns: 2fr 8fr 1fr;
			grid-template-rows: 1fr;
			height: 1.5rem;
			margin: 0;
			
			> label, div {
				grid-area: unset;
			}
			
			> label:first-child {
				font-size: ${props => props.theme.fontSizes.sm};
				-webkit-line-clamp: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: inline-block;
			}
			
			> div > div {
				background: ${props => props.theme.colors.secondary} !important;
			}
		}
	}
`;

export const StyledBarChartTitle = styled.figcaption`
	text-align: center;
	font-size: ${props => props.theme.fontSizes.lg};
	font-weight: ${props => props.theme.fontWeights.bold};
	margin-bottom: ${props => props.theme.spacing.md};
`;

export const StyledBarChartDescription = styled.p`
	text-align: center;
	font-size: ${props => props.theme.fontSizes.xs};
	margin-bottom: 0;
`;
