import styled from 'styled-components';

export const StyledNumberPicker = styled.div`
	min-width: 12rem;
	
	label {
		width: 100%;
		display: flex;
		align-items: center;
		
		span {
			display: inline-block;
			margin-inline-end: 0.5rem;
		}
		
		> div {
			flex-grow: 1;
		}
	}
`;
