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
                        titles
                        people_count
                    }
                    circles {
                        title
                        people_count
                    }
                }
            }
		`,
		{ minShows: 3, minPeople: 10 }
	);

	const formattedData = useMemo(() => {
		const formattedIntersections = rawData?.VennDiagram?.intersections.map(({ titles, people_count }) => ({
			sets: titles as string[],
			size: people_count as number,
		})) || [];

		const formattedCircles = rawData?.VennDiagram?.circles.map(({ title, people_count }) => ({
			sets: [title] as string[],
			size: people_count as number,
		})) || [];

		return [...formattedIntersections, ...formattedCircles];
	}, [rawData]);

	return (
		formattedData && <Venn sets={formattedData} />
	);
};
