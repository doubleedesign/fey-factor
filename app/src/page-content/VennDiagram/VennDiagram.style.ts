import styled from 'styled-components';

export const StyledVennDiagramWrapper = styled.div`
	height: calc(100vh - 280px);
	padding: ${props => props.theme.spacing.xl};
	background: ${props => props.theme.colors.background};
`;