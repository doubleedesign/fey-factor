import { FC } from 'react';
import { StyledShowCard, StyledShowData, StyledShowDataItem } from './ShowCard.style';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ShowCardQuery } from '../../../__generated__/ShowCardQuery.graphql.ts';
import { MiniTable } from '../../typography/MiniTable/MiniTable.tsx';
import pick from 'lodash/pick';
import { Label } from '../../typography';

type ShowCardProps = {
	id: number;
};

export const ShowCard: FC<ShowCardProps> = ({ id }: ShowCardProps) => {
	const details = useLazyLoadQuery<ShowCardQuery>(
		graphql`
            query ShowCardQuery($id: ID!) {
                TvShow(id: $id) {
                    id
                    title
                    start_year
                    end_year
                    season_count
                    episode_count
                    people {
                        id
                    }
                }
            }
		`,
		{ id: id.toString() }
	);

	return details.TvShow && (
		<StyledShowCard data-testid="ShowCard">
			<StyledShowData>
				<StyledShowDataItem>Episodes: <strong>{details.TvShow.episode_count}</strong></StyledShowDataItem>
				<StyledShowDataItem>Seasons: <strong>{details.TvShow.season_count}</strong></StyledShowDataItem>
				<StyledShowDataItem>Start Year: <strong>{details.TvShow.start_year}</strong></StyledShowDataItem>
				<StyledShowDataItem>End Year: <strong>{details.TvShow.end_year}</strong></StyledShowDataItem>
			</StyledShowData>
			<a href={`https://www.themoviedb.org/tv/${details.TvShow.id}`} target="_blank">
				View on TMDB <i className="fa-light fa-arrow-up-right-from-square"></i>
			</a>
		</StyledShowCard>
	);
};
