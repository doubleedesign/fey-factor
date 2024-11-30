import styled from 'styled-components';

export const StyledMarkdownContent = styled.div`
	background: ${props => props.theme.colors.background};
	padding: ${props => props.theme.spacing.md};
	
	h2, h3 {
		font-weight: ${props => props.theme.fontWeights.bold};
		margin-top: ${props => props.theme.spacing.lg};
		margin-bottom: ${props => props.theme.spacing.sm};
	}
	
	blockquote {
		text-align: center;
		color: ${props => props.theme.colors.secondary};
		padding: ${props => props.theme.spacing.md};
		margin: 0;
		font-size: ${props => props.theme.fontSizes.xl};
		font-weight: ${props => props.theme.fontWeights.bold};
		font-style: italic;
	}
	
	p {
		margin-top: 0;
	}
	
	hr {
		border: 0;
		border-top: 1px solid ${props => props.theme.colors.subtle};
		margin-top: ${props => props.theme.spacing.lg};
	}
	
	sup {
		font-weight: ${props => props.theme.fontWeights.semibold};
		color: ${props => props.theme.colors.secondary};
	}
	
	.footnotes {
		ol {
			padding-left: 0;
			margin-inline-start: 1rem;
		}
	}
`;
