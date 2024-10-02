import { FC, PropsWithChildren, ReactNode } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { ShowCardInnerQuery } from '../../../__generated__/ShowCardInnerQuery.graphql.ts';
import { StyledShowCard, StyledShowCardContent, StyledShowCardHeader, StyledShowCardPoster } from './ShowCard.style.ts';

type ShowCardInnerProps = {
	id: string;
	tag: ReactNode;
	renderTitle?: boolean;
};

/**
 * This inner component exists so that if the ShowCard is in expandable form,
 * we don't query the TMDB API for fields not in the local database (e.g., overview, images) until they're actually needed.
 * The {children} are parts of the expanded content that can be passed in from the ShowCard because their data is already needed there anyway,
 * so doing it that way prevents over-fetching here.
 */
export const ShowCardInner: FC<PropsWithChildren<ShowCardInnerProps>> = ({ id, tag, renderTitle = true, children }) =>  {
	const data = useLazyLoadQuery<ShowCardInnerQuery>(
		graphql`
            query ShowCardInnerQuery($id: ID!) {
                TvShow(id: $id) {
                    title
                    start_year
                    end_year
                    season_count
                    episode_count
                    overview
                    poster_path
                }
            }
		`,
		{ id: id.toString() }
	);


	return data && (
		<StyledShowCard data-testid="ShowCard">
			<StyledShowCardPoster>
				<img src={`https://image.tmdb.org/t/p/w185${data?.TvShow?.poster_path}`} alt={data?.TvShow?.title} />
			</StyledShowCardPoster>
			<StyledShowCardContent>
				{renderTitle && (
					<StyledShowCardHeader>
						<h3>{data?.TvShow?.title}</h3>
						{tag}
					</StyledShowCardHeader>
				)}

				{/** TODO: Show episode count, season count, start year, end year */}

				{data.TvShow?.overview && <p>{data.TvShow?.overview}</p>}

				{children}

				<a href={`https://www.themoviedb.org/tv/${id}`} target="_blank">
					View on TMDB <i className="fa-light fa-arrow-up-right-from-square"></i>
				</a>
			</StyledShowCardContent>
		</StyledShowCard>
	);
};
