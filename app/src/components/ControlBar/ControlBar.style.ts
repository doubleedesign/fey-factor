import styled from 'styled-components';
import { readableColor } from 'polished';
import { StyledHeading } from '../Heading/Heading.style.ts';

export const StyledControlBar = styled.div`
	background: ${props => props.theme.colors.secondary};
	color: ${props => readableColor(props.theme.colors.secondary)};
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	padding-block: ${props => props.theme.spacing.md};
	
	${StyledHeading} {
		font-size: ${props => props.theme.fontSizes.display};
	}
`;
