import styled from 'styled-components';
import { StyledButton } from '../Button.style.ts';
import { shade } from 'polished';

export const StyledSwapButton = styled(StyledButton)`
	background: #00c89b;
	color: white;
	
	svg {
		transition: all 0.3s ease;
	}
	
	&.flipped {
		svg {
			transform: scaleX(-1);
		}
	}
	
	&:hover, &:focus, &:active {
		background: ${() => shade(0.2, '#00c89b')};
		text-decoration-color: white;
	}
`;
