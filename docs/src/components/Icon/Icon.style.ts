import styled from 'styled-components';

export const StyledIcon = styled.span`
	&[title*="Primary key"] {
		svg {
			color: #ffc865;
		}
	}

	&[title="Foreign key"] {
		svg {
			color: #c4c4c4;
		}
	}
`;
