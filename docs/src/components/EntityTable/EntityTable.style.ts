import styled from 'styled-components';

export const StyledEntityTable = styled.table`
	box-shadow: 0 0 0 1px #0b1c72;
	width: 100%;
	border-collapse: collapse;
	font-size: 0.9rem;
	cursor: default;

	th {
		text-align: center;
		background: #0b1c72;
		color: white;
		line-height: 1;
		padding: 0.3rem;
	}

	tr {
		td {
			line-height: 1;
			padding: 0.3rem 0.5rem;
			border-top: 1px solid #EDEDED;

			&.icon {
				width: 1rem;
				padding-right: 0;
			}
			
			&.data-type {
				width: 2.5rem;
				
				span {
					display: inline-block;
					padding: 0.25rem;
					text-transform: uppercase;
					font-size: 0.8em;
					background: #EDEDED;
					
					&:has(a) {
						padding: 0;
						
						a {
							padding: 0.25rem;
						}
					}
				}
			}
		}

		&:first-of-type {
			td {
				border-bottom: 0;
			}
		}

		&.primary-key {
		}
		
		&.foreign-key,
		&.gql-added-field {
			td {
				border-top-color: #AAA; // Darker border on the first row
			}

			+ tr.foreign-key td,
			+ tr.gql-added-field td {
				border-top-color: #EDEDED; // hack to reset the other rows
			}
		}
	}
`;
