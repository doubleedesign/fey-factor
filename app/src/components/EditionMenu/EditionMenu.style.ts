import styled from 'styled-components';
import { readableColor, tint } from 'polished';

export const StyledEditionMenu = styled.div`
	width: 18rem;
	margin-inline: ${props => props.theme.spacing.sm};
	
	div:has([role="listbox"]) {
		margin: 0;
	}
`;

export const StyledSelectControlWrapper = styled.div`	
	> div {
		border-color: ${props => tint(0.3, props.theme.colors.secondary)};
	}
	
	> div > div:first-child {
		display: block;
		padding: 0;
		
		input {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
`;

export const StyledEditionOptionWrapper = styled.div<{ isSelected: boolean; isFocused: boolean }>`
	background-color: ${({ isSelected, isFocused, theme }) => {
		if(isFocused) {
			return tint(0.3, theme.colors.secondary);
		}
		if(isSelected) {
			return theme.colors.secondary;
		}
		
		return tint(0.1, theme.colors.secondary);
	}};
	color: ${({ isSelected, isFocused, theme }) => {
		if(isFocused) {
			return readableColor(tint(0.3, theme.colors.secondary));
		}
		if(isSelected) {
			return readableColor(theme.colors.secondary);
		}
		
		return readableColor(tint(0.1, theme.colors.secondary));
	}};
	transition: all 0.2s ease;
	cursor: pointer;
`;