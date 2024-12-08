import styled from 'styled-components';

export const StyledGenericLoadingState = styled.div`
	background: ${({ theme }) => theme.colors.background};
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	padding: ${props => props.theme.spacing.xl};
	
	p {
		font-weight: ${props => props.theme.fontWeights.bold};
	}
`;
