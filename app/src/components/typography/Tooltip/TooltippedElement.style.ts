import styled from 'styled-components';

export const StyledTooltippedElement = styled.span`
	display: inline-block;
	position: relative;

	.react-tooltip {
		z-index: 900;

		&__show {
			opacity: 1;
		}
	}
`;
