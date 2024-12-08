import styled from 'styled-components';

export const StyledEulerVennWrapper = styled.div`
	transform: translateY(-${props => props.theme.spacing.xl});
	overflow: visible;
	
	small {
		display: block;
		margin-block-start: ${props => props.theme.spacing.lg};
		text-align: center;
	}
`;
