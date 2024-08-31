import styled from 'styled-components';

export const StyledPageWrapper = styled.main`
	background: ${props => `linear-gradient(to bottom, ${props.theme.colors.secondary} 160px, ${props.theme.colors.background} 160px)`};
`;
