import styled from 'styled-components';

export const StyledMultiSelect = styled.div`
	min-width: 12rem;
	position: relative;
	z-index: 700;
`;

export const StyledMultiSelectOptionWrapper = styled.div`
	> [role="option"] {
		padding: ${props => props.theme.spacing.xs};
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
`;

export const StyledMultiSelectLabel = styled.label`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: ${props => props.theme.spacing.xs};
	cursor: pointer;
	
	img {
		width: 1.5rem;
		height: 1.5rem;
	}
	
	span {
		font-size: ${props => props.theme.fontSizes.sm};
	}
`;

export const StyledMultiSelectLabelIconOnly = styled.div`
	width: 1.5rem;
	height: 1.5rem;
	padding: 0;
	border: 0;
	cursor: pointer;
	margin-inline-end: ${props => props.theme.spacing.xs};
	
	img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}
`;

export const StyledMultiSelectInvisibleCheckbox = styled.input`
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
`;

export const StyledMultiSelectCheckbox = styled.input`
`;

export const StyledMultiSelectSelectedPlainText = styled.div`
	color: black;
	width: 12rem;
	font-size: ${props => props.theme.fontSizes.sm};
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`;