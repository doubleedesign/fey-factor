import styled from 'styled-components';

export const StyledShowCard = styled.div`
	> a:last-child {
		display: block;
		text-align: right;
		margin-block-start: ${props => props.theme.spacing.sm};
		margin-inline-end: ${props => props.theme.spacing.md};

		svg {
			font-size: 0.8em;
		}
	}
`;