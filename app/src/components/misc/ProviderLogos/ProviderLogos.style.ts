import styled from 'styled-components';
import { shade } from 'polished';

export const StyledProviderList = styled.ul`
	margin: 0;
	padding: 0;
	display: flex;
	gap: 2px;
`;

export const StyledProviderItem = styled.li`
	display: block;
	width: 1.25rem;
	height: 1.25rem;
	
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.react-tooltip {
		z-index: 700;
		
		&__show {
			opacity: 1;
		}
	}
`;

export const StyledMoreProvidersIndicator = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: ${props => shade(0.1, props.theme.colors.light)};
	height: 1.25rem; 
	width: 1.25rem;
	border-radius: 2px;
	position: relative;
	z-index: 600;
`;