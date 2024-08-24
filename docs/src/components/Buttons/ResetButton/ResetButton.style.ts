import styled from 'styled-components';
import { shade } from 'polished';
import { StyledButton } from '../Button.style.ts';

export const StyledResetButton = styled(StyledButton)`
	background: #0086d6;
	color: white;
	
	svg {
		transition: all 0.5s ease;
	}
	
	&:hover, &:focus, &:active {
		background: ${() => shade(0.2, '#0086d6')};
		text-decoration-color: white;
		
		svg {
			transform: rotate(360deg);
		}
	}
`;
