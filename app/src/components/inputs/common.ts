import styled from 'styled-components';

export const StyledSelectLabel = styled.span`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	position: relative;
	z-index: 900;

	i, svg {
		display: inline-block;
		margin-inline-start: ${props => props.theme.spacing.xs};
	}

	.react-tooltip {
		z-index: 1200;
		max-width: 8rem;
	}
`;