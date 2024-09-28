import styled from 'styled-components';

export const StyledShowCard = styled.div`
	a:last-child {
		display: block;
		text-align: right;
		margin-block-start: ${props => props.theme.spacing.sm};
		
		svg {
			font-size: 0.8em;
		}
	}
`;

export const StyledShowData = styled.ul`
	display: flex;
	flex-wrap: wrap;
	padding: 0;
	margin: 0;
	gap: ${props => props.theme.spacing.xs};
	container-name: StyledShowCardList;
	container-type: inline-size;
`;

export const StyledShowDataItem = styled.li`
	display: block;
	width: 100%;
	flex-basis: 100%;
	
	@container StyledShowCardList (min-width: 300px) {
		width: 40%;
		flex-basis: 40%;
	}

	@container StyledShowCardList (min-width: 400px) {
		width: auto;
		flex-basis: auto;
		padding-inline-end: ${props => props.theme.spacing.sm};
	}
	
	strong {
		font-weight: ${props => props.theme.fontWeights.bold};
	}
`;