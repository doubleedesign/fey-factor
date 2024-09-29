import { FC, useMemo } from 'react';
import { StyledShowCard, StyledShowData, StyledShowDataItem } from './ShowCard.style';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ShowCardQuery, ShowCardQuery$data } from '../../../__generated__/ShowCardQuery.graphql.ts';
import { Label, TooltippedElement } from '../../typography';
import { Expandable } from '../../layout';
import React from 'react';

type ShowCardProps = {
	id: number;
	expandable?: boolean;
};

// @ts-ignore
type Person = ShowCardQuery$data['TvShow']['people'][0];

type ShowCardInnerProps = {
	data: ShowCardQuery$data['TvShow'];
	degree0: Person[];
	degree1: Person[];
	degree2: Person[];
};

const ShowCardInner: FC<ShowCardInnerProps> = ({ data, degree0, degree1, degree2 }) => {

	const renderConnectionSummary = (connections: any[], degree: number) => {
		if (connections.length === 0) return null;

		const degreeText = degree === 1 ? 'first-degree' : 'second-degree';
		const count = connections.length;
		const displayConnections = connections.slice(0, 5).map((person, index, array) => {
			const isLast = index === array.length - 1;

			return (
				<React.Fragment key={person.id}>
					{index > 0 && (
						array.length === 2 ? ( ' and ' )
							: (isLast ? ', and ' : ', ')
					)}
					<a href={`https://www.themoviedb.org/person/${person.id}`} target="_blank" rel="noopener noreferrer">
						{person.name}
					</a>
				</React.Fragment>
			);
		});

		let content;
		if (count === 1) {
			content = `1 ${degreeText} connection: `;
		}
		else if (count < 5) {
			content = `${count} ${degreeText} connections: `;
		}
		else {
			content = `${count} ${degreeText} connections including: `;
		}

		return (
			<p>
				<strong>{content}</strong>
				{displayConnections}.
			</p>
		);
	};


	return data && (
		<StyledShowCard data-testid="ShowCard">
			<StyledShowData>
				<StyledShowDataItem>Episodes: <strong>{data.episode_count}</strong></StyledShowDataItem>
				<StyledShowDataItem>Seasons: <strong>{data.season_count}</strong></StyledShowDataItem>
				<StyledShowDataItem>Start Year: <strong>{data.start_year}</strong></StyledShowDataItem>
				<StyledShowDataItem>End Year: <strong>{data.end_year}</strong></StyledShowDataItem>
			</StyledShowData>

			{degree0.length > 0 && <p>{degree0[0].name} is {degree0[0]?.roles?.map((role: { name: string; }) => {
				return role?.name?.replace('_', ' ');
			}).join(', ')}.</p>}

			{renderConnectionSummary(degree1, 1)}
			{renderConnectionSummary(degree2, 2)}

			<a href={`https://www.themoviedb.org/tv/${data.id}`} target="_blank">
				View on TMDB <i className="fa-light fa-arrow-up-right-from-square"></i>
			</a>
		</StyledShowCard>
	);
};

export const ShowCard = ({ id, expandable }: ShowCardProps) => {
	const data = useLazyLoadQuery<ShowCardQuery>(
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
                        name
                        degree
                        roles {
                            name
                        }
                    }
                }
            }
		`,
		{ id: id.toString() }
	);

	const isFey = useMemo(() => {
		return data?.TvShow?.people?.filter(person => person?.degree === 0) ?? [];
	}, [data.TvShow?.people]);

	const degreeOne = useMemo(() => {
		return data?.TvShow?.people?.filter(person => person?.degree === 1) ?? [];
	}, [data?.TvShow?.people]);

	const degreeTwo = useMemo(() => {
		return data?.TvShow?.people?.filter(person => person?.degree === 2) ?? [];
	}, [data?.TvShow?.people]);

	let tag = null;
	if(isFey.length > 0) {
		tag = <TooltippedElement id={`feyjacent-tooltip-${data?.TvShow?.id}`} tooltip="This is a Tina Fey production" position="bottom">
			<Label text="It's Fey day" type="success"/>
		</TooltippedElement>;
	}
	else if(degreeOne.length > 4) {
		tag = <TooltippedElement id={`feyjacent-tooltip-${data?.TvShow?.id}`} tooltip={`${degreeOne.length} first-degree connections`} position="bottom">
			<Label text="Highly Feyjacent" type="accent" />
		</TooltippedElement>;
	}
	else if(degreeOne.length > 2 && degreeTwo.length > 10) {
		// eslint-disable-next-line max-len
		tag = <TooltippedElement id={`feyjacent-tooltip-${data?.TvShow?.id}`} tooltip={`${degreeOne.length} first-degree and ${degreeTwo.length} second-degree connections`} position="bottom">
			<Label text="Pretty Feyjacent" type="subtle" />
		</TooltippedElement>;
	}
	else if(degreeOne.length > 0 && degreeTwo.length > 4) {
		// eslint-disable-next-line max-len
		tag = <TooltippedElement id={`feyjacent-tooltip-${data?.TvShow?.id}`} tooltip={`${degreeOne.length} first-degree and ${degreeTwo.length} second-degree connections`} position="bottom">
			<Label text="Somewhat Feyjacent" type="subtler" />
		</TooltippedElement>;
	}

	return expandable && data?.TvShow ? (
		<Expandable title={data.TvShow?.title ?? ''} titleTag={tag}>
			<ShowCardInner data={data.TvShow} degree0={isFey} degree1={degreeOne} degree2={degreeTwo} />
		</Expandable>
	) : (
		<ShowCardInner data={data.TvShow} degree0={isFey} degree1={degreeOne} degree2={degreeTwo} />
	);
};
