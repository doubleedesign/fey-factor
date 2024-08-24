import styled from 'styled-components';

export const StyledEntityTableGroup = styled.div`
	padding: 1rem;
	border: 1px solid #CCC;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: fit-content;
	min-width: 325px;  
	transition: all 0.2s ease;
	box-shadow: 0 0 0.5rem 0 transparent;
	opacity: 1;
	
	&.dimmed {
		opacity: 0.25;
	}
	
	&.highlighted {
		opacity: 1;
		box-shadow: 0 0 0.5rem 0 #ffb550;
	}
`;
