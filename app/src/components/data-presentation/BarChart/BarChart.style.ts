import styled from 'styled-components';

export const StyledBarChart = styled.figure`
	background: ${props => props.theme.colors.background};
	padding: ${props => props.theme.spacing.md};
`;

export const StyledBarChartTitle = styled.figcaption`
	text-align: center;
	font-size: ${props => props.theme.fontSizes.lg};
	font-weight: ${props => props.theme.fontWeights.bold};
	margin-bottom: ${props => props.theme.spacing.md};
`;

