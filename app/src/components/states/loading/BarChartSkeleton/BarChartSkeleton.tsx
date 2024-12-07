import { FC } from 'react';
import { StyledBarChartSkeleton, StyledBarChartSkeletonRow, StyledBarChartSkeletonTitle } from './BarChartSkeleton.style';
import Skeleton from 'react-loading-skeleton';

type BarChartSkeletonProps = {
	rows: number;
	title?: string;
};

export const BarChartSkeleton: FC<BarChartSkeletonProps> = ({ rows, title }) => {
	return (
		<StyledBarChartSkeleton data-testid="BarChartSkeleton">
			{title && <StyledBarChartSkeletonTitle>{title}</StyledBarChartSkeletonTitle>}
			{Array.from({ length: rows }).map((_, index) => (
				<StyledBarChartSkeletonRow key={index}>
					<Skeleton />
				</StyledBarChartSkeletonRow>
			))}
		</StyledBarChartSkeleton>
	);
};
