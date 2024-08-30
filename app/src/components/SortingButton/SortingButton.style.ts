import styled from 'styled-components';

export const StyledSortingButton = styled.button<{ $direction: 'asc' | 'desc', $active: boolean }>`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	background: transparent;
	border: 0;
	appearance: none;
	font-size: inherit;
	color: inherit;
	font-weight: inherit;
	outline: none;
	cursor: pointer;
	padding: 0;
	
	svg {
		opacity: ${props => props.$active ? '1' : '0.5'};
		display: block;
		font-size: 0.9em;
		transition: transform 0.3s ease;
		transform: rotate(${props => props.$direction === 'asc' ? '0' : '180deg'});
	}
`;
