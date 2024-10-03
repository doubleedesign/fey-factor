import { FC } from 'react';
import { StyledShowCardSkeleton, StyledShowCardSkeletonContent, StyledShowCardSkeletonHeader, StyledShowCardSkeletonPoster } from './ShowCardSkeleton.style.ts';
import Skeleton from 'react-loading-skeleton';
import { StyledButtonGroup } from '../../common.ts';

type ShowCardSkeletonProps = {};

export const ShowCardSkeleton: FC<ShowCardSkeletonProps> = () => {
	return (
		<StyledShowCardSkeleton data-testid="ShowCardSkeleton">
			<StyledShowCardSkeletonPoster>
				<Skeleton height={140} />
			</StyledShowCardSkeletonPoster>
			<StyledShowCardSkeletonContent>
				<StyledShowCardSkeletonHeader>
					<Skeleton height={24} />
				</StyledShowCardSkeletonHeader>
				<Skeleton count={3} />
				<StyledButtonGroup $align="right">
					<Skeleton width={100} height={20} />
				</StyledButtonGroup>
			</StyledShowCardSkeletonContent>
		</StyledShowCardSkeleton>
	);
};
