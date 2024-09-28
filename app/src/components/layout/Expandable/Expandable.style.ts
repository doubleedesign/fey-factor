import styled from 'styled-components';
import { tint, transparentize } from 'polished';

export const StyledExpandableTitle = styled.summary`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-inline-end: ${props => props.theme.spacing.xs};
	// Limit to one line to keep the height predictable for animation purposes
	-webkit-line-clamp: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	// Make it look like a link
	color: ${props => props.theme.colors.dark};
	text-decoration: underline;
	text-decoration-color: ${props => transparentize(0.5, props.theme.colors.dark)};
	transition: all 0.2s ease-in-out;
	cursor: pointer;

	&:hover, &:focus, &:active {
		color: ${props => tint(0.2, props.theme.colors.info)};
		text-decoration-color: ${props => props.theme.colors.info};
	}
	
	&::marker,
	::-webkit-details-marker {
		content: '';
	}
	
	svg {
		font-size: 0.8em;
		position: relative;
		top: -1px;
		transition: transform 0.2s ease-in-out;
		transform-origin: center;
	}
`;


export const StyledExpandable = styled.details`
	line-height: 1.25;
	height: calc(1rem * 1.25);
	transition: height 0.2s ease-in-out; 
	
	&[open] {
		// the data is predictable enough that that fixed height is ok to keep the animation simple
		height: 100px;
		
		${StyledExpandableTitle} { 
			svg {
				transform: rotate(45deg);
			}
		}
	}
`;