import styled from 'styled-components';

export const StyledMarkdownContent = styled.div`
	background: ${props => props.theme.colors.background};
	padding: ${props => props.theme.spacing.md};
	
	p {
		margin-top: 0;
	}
`;
