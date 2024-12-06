import { FC, useMemo } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { VennDiagramQuery, VennDiagramQuery$data } from '../../__generated__/VennDiagramQuery.graphql.ts';
import { Venn } from '../../components/data-presentation/Venn/Venn';

type VennDiagramProps = {
	maxAverageDegree: number;
	minConnections: number;
};

export const VennDiagram: FC<VennDiagramProps> = ({ maxAverageDegree, minConnections }: VennDiagramProps) => {
	const rawData: VennDiagramQuery$data = useLazyLoadQuery<VennDiagramQuery>(
		graphql`
            query VennDiagramQuery($maxAverageDegree: Float, $minConnections: Int!) {
                VennDiagram(
                    maxAverageDegree: $maxAverageDegree
                    minConnections: $minConnections
                ) {
                    data {
                        name
                        sets
                    }
                }
            }
		`,
		{ maxAverageDegree, minConnections }
	);

	const formattedData = useMemo(() => {
		return rawData?.VennDiagram?.data?.map((set) => ({
			name: set.name as string,
			sets: set.sets as string[]
		}));
	}, [rawData?.VennDiagram?.data]);

	return (
		formattedData ? <Venn data={formattedData} /> : <></>
	);
};
