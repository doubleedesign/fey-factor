import styled from 'styled-components';

export const StyledNetworkDiagram = styled.div`
	background: ${props => props.theme.colors.background};
	max-height: 800px;
	width: 100vw;
	margin-left: calc(-50vw + 50%); /* Offset left by half the viewport width */
	margin-right: calc(-50vw + 50%); /* Offset right by half the viewport width */
`;
