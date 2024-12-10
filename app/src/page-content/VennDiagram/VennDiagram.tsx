import { FC, useMemo } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { VennDiagramQuery, VennDiagramQuery$data } from '../../__generated__/VennDiagramQuery.graphql.ts';
import { Venn } from '../../components/data-presentation/Venn/Venn';
import { useVennContext } from '../../controllers/VennContext.tsx';

type VennDiagramProps = {
};

export const VennDiagram: FC<VennDiagramProps> = () => {
	const { maxAverageDegree, minConnections, selectedRoles } = useVennContext();

	const roleIds = useMemo(() => {
		return selectedRoles.map((role) => Number(role.value));
	}, [selectedRoles]);

	const rawData: VennDiagramQuery$data = useLazyLoadQuery<VennDiagramQuery>(
		graphql`
            query VennDiagramQuery($maxAverageDegree: Float, $minConnections: Int!, $roleIds: [Int]) {
                VennDiagram(
                    maxAverageDegree: $maxAverageDegree,
                    minConnections: $minConnections,
	                roleIds: $roleIds
                ) {
                    data {
	                    id
                        name
                        sets
                    }
                }
            }
		`,
		{ maxAverageDegree, minConnections, roleIds }
	);

	const formattedData = useMemo(() => {
		return rawData?.VennDiagram?.data?.map((set) => ({
			id: set.id as string,
			name: set.name as string,
			sets: set.sets as string[]
		}));
	}, [rawData?.VennDiagram?.data]);

	return (
		formattedData ? <Venn data={formattedData} /> : <></>
	);
};
