import styled from 'styled-components';

export const StyledLinkToNode = styled.a`
	text-decoration: underline;
	text-decoration-color: rgba(0, 0, 0, 0.25);
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	cursor: pointer;
	pointer-events: auto;
	
	svg {
		transform: rotate(90deg);
		margin-inline-start: 0.25rem;
		transition: all 0.2s ease;
	}
	
	&:hover, &:focus, &:active {
		text-decoration-color: currentColor;
	}
`;
