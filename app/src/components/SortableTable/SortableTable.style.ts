import styled from 'styled-components';
import { shade } from 'polished';

export const StyledSortableTable = styled.table`
	width: 100%;
	margin-bottom: 1rem;
	border-collapse: collapse;

	th, td {
		text-align: right;
		padding: 0.25rem 1rem 0.25rem 0.25rem;
		border-right: 1px solid ${shade(0.1, '#f2f2f2')};

		&[data-fieldkey="id"],
		&[data-fieldkey="title"] {
			text-align: left;
			padding-right: 0.25rem;
		}
	}

	thead th {
		background-color: #0086d6;
		color: white;
		text-align: left;
	}

	tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	[data-fieldkey="unitCode"] {
		width: 6.5rem;
	}

	[data-fieldkey="unitName"] {
		width: 10rem;
		max-width: 15rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		&:is(td) {
			border-right: 1px solid ${shade(0.1, '#f2f2f2')};
		}
	}

	[data-fieldkey="taskTargetGrade"] {
		text-align: center;
		width: 5rem;

		&:is(td) {
			svg {
				font-size: 1.4em;
			}
		}
	}

	[data-fieldkey="status"] {
		text-align: center;
		width: 5rem;

		span:only-child {
			margin: 0 auto;
		}
	}

	[data-fieldkey="due_date"] {
		width: 13rem;
	}
`;
