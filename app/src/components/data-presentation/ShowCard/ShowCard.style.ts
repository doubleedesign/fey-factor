import styled from 'styled-components';
import { tint } from 'polished';

export const StyledShowCardContainer = styled.div`
	padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
	margin-block-end: ${props => props.theme.spacing.md};
	
	&:nth-of-type(odd) {
		background-color: ${props => tint(0.8, props.theme.colors.subtle)};
	}
`;

export const StyledShowCard = styled.div`
	display: grid;
	grid-template-columns: 1fr 4fr;
	gap: ${props => props.theme.spacing.md};
	padding-block: ${props => props.theme.spacing.sm};
`;

export const StyledShowCardPoster = styled.div`
	img {
		width: 100%;
	}
`;

export const StyledShowCardContent = styled.div`
	
	p {
		margin-block-start: 0;
		margin-block-end: ${props => props.theme.spacing.sm};
		
		&:first-child {
			font-weight: ${props => props.theme.fontWeights.bold};
		}
		
		&:not(:first-child) {
			font-size: ${props => props.theme.fontSizes.sm};
		}
	}
	
	a {
		color: ${props => props.theme.colors.info};
		transition: color 0.2s ease-in-out;
		
		&:hover, &:focus, &:active {
			color: ${props => tint(0.2, props.theme.colors.secondary)};
		}
	}

	> a:last-child {
		display: block;
		text-align: right;
		margin-block-start: ${props => props.theme.spacing.sm};
		margin-inline-end: ${props => props.theme.spacing.md};
		font-size: ${props => props.theme.fontSizes.sm};

		svg {
			font-size: 0.8em;
		}
	}
`;

export const StyledShowCardHeader = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: ${props => props.theme.spacing.xs};
	align-items: center;
	margin-block-end: ${props => props.theme.spacing.sm};
	flex-wrap: wrap;
	
	h3 {
		font-weight: ${props => props.theme.fontWeights.bold};
		line-height: 1.2;
	}
	
	> span {
		transform: translateY(-2px);
	}
`;