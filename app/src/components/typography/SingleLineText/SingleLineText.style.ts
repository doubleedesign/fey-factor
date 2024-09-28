import styled from 'styled-components';

export const StyledSingleLineText = styled.span`
	-webkit-line-clamp: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
`;
