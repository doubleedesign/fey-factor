import { FC, useMemo } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { VennDiagramQuery } from '../../__generated__/VennDiagramQuery.graphql.ts';
import { Venn } from '../../components/data-presentation/Venn/Venn';

export const VennDiagram: FC = () => {
	const rawData = useLazyLoadQuery<VennDiagramQuery>(
		graphql`
            query VennDiagramQuery($minShows: Int, $minPeople: Int!) {
                VennDiagram(minShows: $minShows, minPeople: $minPeople) {
                    intersections {
	                    shows
	                    people
                    }
	                circles {
		                show
	                    people
	                }
                }
            }
		`,
		{ minShows: 5, minPeople: 10 }
	);

	const formattedData = useMemo(() => {
		const formattedIntersections = rawData?.VennDiagram?.intersections.map(({ shows, people }) => ({
			key: shows as string[],
			data: people as number,
		})) || [];

		const formattedCircles = rawData?.VennDiagram?.circles.map(({ show, people }) => ({
			key: [show] as string[],
			data: people as number,
		})) || [];

		return [...formattedIntersections, ...formattedCircles];
	}, [rawData]);

	return (
		formattedData && <Venn data={formattedData} />
	);
};
