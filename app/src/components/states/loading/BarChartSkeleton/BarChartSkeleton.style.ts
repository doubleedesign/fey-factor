import styled from 'styled-components';
import { StyledBarChart, StyledBarChartTitle } from '../../../data-presentation/BarChart/BarChart.style.ts';

export const StyledBarChartSkeleton = styled(StyledBarChart)``;

export const StyledBarChartSkeletonTitle = styled(StyledBarChartTitle)``;

export const StyledBarChartSkeletonRow = styled.div`
	display: flex;
	height: 1.5rem;
	align-items: center;
	
	> span {
		display: block;
		width: 100%;
	}
`;