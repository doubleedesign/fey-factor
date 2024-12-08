import styled from 'styled-components';

export const StyledVennPositionHandler = styled.div<{ $transform?: string }>`
	${({ $transform }) => $transform ? `transform: ${$transform};` : ''}
	transition: transform 0.3s;
	overflow: visible;
	
	svg {
		overflow: visible;
	}
`;
