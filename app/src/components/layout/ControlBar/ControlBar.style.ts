import styled from 'styled-components';
import { readableColor } from 'polished';
import { StyledHeading } from '../../typography/Heading/Heading.style';

export const StyledControlBar = styled.div`
	background: ${props => props.theme.colors.primary};
	color: ${props => readableColor(props.theme.colors.primary)};
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	padding-block: ${props => props.theme.spacing.md};
	padding-inline-start: 2.5rem; // space for the menu button
	
	${StyledHeading} {
		font-size: ${props => props.theme.fontSizes.display2};
	}
`;
