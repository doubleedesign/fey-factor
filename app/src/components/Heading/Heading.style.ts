import styled from 'styled-components';

export const StyledHeading = styled.h2`
	font-family: ${props => props.theme.fontFamily.heading};
	font-weight: ${props => props.theme.fontWeights.normal};
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	
	&:is(h1) {
		font-size: ${props => props.theme.fontSizes.xxl};
	}
	
	&:is(h2) {
		font-size: ${props => props.theme.fontSizes.xl};
	}
	
	&:is(h3) {
		font-size: ${props => props.theme.fontSizes.lg};
	}
	
	&:is(h4) {
		font-size: ${props => props.theme.fontSizes.md};
	}
	
	.above-heading {
		display: block;
		font-family: ${props => props.theme.fontFamily.body};
		font-size: ${props => props.theme.fontSizes.sm};
		text-transform: uppercase;
		width: 100%;
		flex-basis: 100%;
	}
	
	&:has(.above-heading) {
		line-height: 1;
	}
	
	a {
		color: currentColor;
	}
`;
