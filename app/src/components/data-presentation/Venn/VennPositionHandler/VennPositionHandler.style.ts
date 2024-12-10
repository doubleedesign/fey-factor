import styled from 'styled-components';

export const StyledVennPositionHandler = styled.div<{ $transform?: string }>`
	${({ $transform }) => $transform ? `transform: ${$transform};` : ''}
	transition: transform 0.3s;
	overflow: visible;
	height: 100%;
	width: 100%;
	position: relative;
	
	svg {
		overflow: visible;
	}
`;

export const StyledVennPositionContent = styled.div`
	position: absolute;
	inset: 0 0 0 0;
`;