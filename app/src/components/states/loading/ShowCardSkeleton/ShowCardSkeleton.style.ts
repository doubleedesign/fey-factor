import styled from 'styled-components';
import { StyledShowCard, StyledShowCardContent, StyledShowCardHeader, StyledShowCardPoster } from '../../../data-presentation/ShowCard/ShowCard.style.ts';

export const StyledShowCardSkeleton = styled(StyledShowCard)``;

export const StyledShowCardSkeletonPoster = styled(StyledShowCardPoster)``;

export const StyledShowCardSkeletonHeader = styled(StyledShowCardHeader)`
	span {
		width: 100%;
		margin-top: ${props => props.theme.spacing.xs};
	}
`;

export const StyledShowCardSkeletonContent = styled(StyledShowCardContent)``;