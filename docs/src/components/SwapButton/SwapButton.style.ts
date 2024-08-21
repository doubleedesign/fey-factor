import styled from 'styled-components';

export const StyledSwapButton = styled.button`
	margin: 0.25rem;
	background: #00c89b;
	color: white;
	border: 0;
	appearance: none;
	font-family: inherit;
	border-radius: 0.25rem;
	padding: 0.25rem 1rem;
	font-weight: bold;
	cursor: pointer;
	
	svg {
		transition: all 0.3s ease;
	}
	
	&.flipped {
		svg {
			transform: scaleX(-1);
		}
	}
`;
