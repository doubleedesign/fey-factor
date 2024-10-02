import styled from 'styled-components';
import { tint } from 'polished';

export const Container = styled.section<{ $stretch?: boolean }>`
	width: 100%;
	max-width: 1140px;
	margin: 0 auto;
	padding-inline: ${props => props.theme.spacing.sm};
	display: flex;
	flex-direction: ${props => props.$stretch ? 'column' : 'row'};
`;

export const Grid = styled.div<{ $maxCols: number }>`
	display: grid;
	grid-template-columns: repeat(${props => props.$maxCols}, 1fr);
	gap: ${props => props.theme.spacing.md};
`;

export const GridColumn = styled.div`
	display: flex;
	flex-direction: column;
`;


export const StyledTable = styled.table`
	width: 100%;
	margin-bottom: 1rem;
	border-collapse: collapse;
	border: 1px solid ${props => props.theme.colors.subtle};
	background: ${props => props.theme.colors.background};

	th, td {
		font-family: ${props => props.theme.fontFamily.body};
		text-align: right;
		padding: ${props => props.theme.spacing.sm};
		border-right: 1px solid ${props => tint(0.4, props.theme.colors.subtle)};

		&[data-fieldkey="rank"] {
			width: 3rem;
		}

		&[data-fieldkey="id"] {
			width: 3rem;
		}

		&[data-fieldkey="rank"],
		&[data-fieldkey="id"],
		&[data-fieldkey="title"] {
			text-align: left;
			padding-right: 0.25rem;
		}

		&[data-fieldkey="episode_count"],
		&[data-fieldkey="total_connections"],
		&[data-fieldkey="average_degree"],
		&[data-fieldkey="weighted_score"] {
			width: 5rem;
			max-width: 5rem;
		}

		&[data-fieldkey="available_on"] {
			width: 5rem;
		}
	}
	
	thead th {
		background-color: ${props => props.theme.colors.secondary};
		border-right-color: ${props => tint(0.3, props.theme.colors.secondary)};
		color: white;
		text-align: left;
		position: relative;
		z-index: 600;
	}
`;