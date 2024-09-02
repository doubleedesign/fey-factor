import styled from 'styled-components';
import { transparentize, readableColor } from 'polished';

export const StyledEditionCard = styled.div`
	padding: ${props => props.theme.spacing.sm};
	display: flex;
	align-items: center;
	justify-content: flex-start;
`;

export const StyledProfileText = styled.div`
	display: flex;
	flex-direction: column;
	
	> span {
		font-size: ${props => props.theme.fontSizes.xs};
		text-transform: uppercase;
	}
`;

export const StyledProfileName = styled.div`
	width: 100%;
	flex-basis: auto;
	font-family: ${props => props.theme.fontFamily.heading};
	font-size: ${props => props.theme.fontSizes.lg};
	display: flex;
	align-items: center;
`;

export const StyledProfileImage = styled.div`
	width: 3rem;
	height: 3rem;
	border: 1px solid ${props => transparentize(0.5, readableColor(props.theme.colors.secondary))};
	padding: 0.125rem;
	border-radius: 100%;
	margin-inline-end: ${props => props.theme.spacing.sm};
	
	&:has(svg) {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	svg {
		font-size: 1.5rem;
	}

	img {
		border-radius: 100%;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center center;
	}
`;