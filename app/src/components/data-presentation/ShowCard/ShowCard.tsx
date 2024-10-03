import { Suspense, useMemo } from 'react';
import { StyledShowCardContainer } from './ShowCard.style';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ShowCardQuery, ShowCardQuery$data } from '../../../__generated__/ShowCardQuery.graphql.ts';
import { Label, TooltippedElement } from '../../typography';
import { Expandable } from '../../layout';
import React from 'react';
import { ShowCardInner } from './ShowCardInner.tsx';
import { ShowCardSkeleton } from '../../loading/ShowCardSkeleton/ShowCardSkeleton.tsx';

type ShowCardProps = {
	id: number;
	expandable?: boolean;
};

// @ts-ignore
type Person = ShowCardQuery$data['TvShow']['people'][0];

export const ShowCard = ({ id, expandable }: ShowCardProps) => {
	const data = useLazyLoadQuery<ShowCardQuery>(
		graphql`
            query ShowCardQuery($id: ID!) {
                TvShow(id: $id) {
                    id
                    title
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

	const degree0 = useMemo(() => {
		return data?.TvShow?.people?.filter(person => person?.degree === 0) ?? [];
	}, [data.TvShow?.people]);

	const degreeOne = useMemo(() => {
		return data?.TvShow?.people?.filter(person => person?.degree === 1) ?? [];
	}, [data?.TvShow?.people]);

	const degreeTwo = useMemo(() => {
		return data?.TvShow?.people?.filter(person => person?.degree === 2) ?? [];
	}, [data?.TvShow?.people]);

	let tag = null;
	if(degree0.length > 0) {
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

	const renderConnectionSummary = (connections: any[]) => {
		if (connections.length === 0) return null;
		const connectionsToList = connections.length > 7 ? connections.slice(0, 6) : connections;

		const displayConnections = connectionsToList.map((person, index, array) => {
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

		return (
			<p><strong>{connections.length > 7 ? 'Connections include: ' : 'Connections: ' }</strong>{displayConnections}.</p>
		);
	};

	return expandable && data?.TvShow?.title ? (
		<Expandable title={data.TvShow?.title ?? ''} titleTag={tag}>
			<Suspense fallback={<ShowCardSkeleton />}>
				<ShowCardInner id={data.TvShow.id} tag={tag} renderTitle={false}>
					{degree0.length > 0 && <p>{degree0[0]?.name} is {degree0[0]?.roles?.map((role) => {
						return role?.name?.replace('_', ' ');
					}).join(', ')}.</p>}
					{renderConnectionSummary([...degreeOne, ...degreeTwo])}
				</ShowCardInner>
			</Suspense>
		</Expandable>
	) : (
		<StyledShowCardContainer>
			{data.TvShow?.id && (
				<Suspense fallback={<ShowCardSkeleton />}>
					<ShowCardInner id={data.TvShow.id} tag={tag}>
						{degree0.length > 0 && <p>{degree0[0]?.name} is {degree0[0]?.roles?.map((role) => {
							return role?.name?.replace('_', ' ');
						}).join(', ')}.</p>}
						{renderConnectionSummary([...degreeOne, ...degreeTwo])}
					</ShowCardInner>
				</Suspense>
			)}
		</StyledShowCardContainer>
	);
};
