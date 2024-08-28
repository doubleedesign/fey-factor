import styled from 'styled-components';

export const StyledIcon = styled.span`
	cursor: pointer;
	
	&[title*="primary key"] {
		svg {
			color: #ffc865;
		}
	}

	&[title*="foreign key"] {
		svg {
			color: #c4c4c4;
		}
	}
`;
