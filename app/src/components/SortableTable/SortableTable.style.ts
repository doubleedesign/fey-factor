import styled from 'styled-components';
import { shade } from 'polished';

export const StyledSortableTable = styled.table`
	
	thead th {
		background-color: #337ab7;
		color: white;
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