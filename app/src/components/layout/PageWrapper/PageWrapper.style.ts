import styled from 'styled-components';

export const StyledPageWrapper = styled.main`
	display: flex;
	flex-grow: 1;
	background: ${props => `linear-gradient(to bottom, ${props.theme.colors.primary} 160px, ${props.theme.colors.background} 160px)`};
`;
