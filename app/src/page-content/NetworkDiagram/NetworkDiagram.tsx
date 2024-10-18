import { FC, useMemo, useRef } from 'react';
import { StyledNetworkDiagram } from './NetworkDiagram.style';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { NetworkDiagramQuery } from '../../__generated__/NetworkDiagramQuery.graphql.ts';
import { networkWranglers } from '../../wranglers/network.ts';
import { useRankingContext } from '../../controllers/RankingContext.tsx';
import { Network } from '../../components/data-presentation/Network/Network.tsx';
import { useResizeObserver } from '../../hooks/use-resize-observer.ts';

type NetworkDiagramProps = {
	nodesAre: string;
};

export const NetworkDiagram: FC<NetworkDiagramProps> = ({ nodesAre }) => {
	const { degreeZero } = useRankingContext();
	const containerRef = useRef<HTMLDivElement | null>(null);
	const dimensions= useResizeObserver(containerRef, [], 300);

	// Note: Edge titles are renamed so they have the same fields as Nodes, allowing for swapping of nodes and edges
	const data = useLazyLoadQuery<NetworkDiagramQuery>(graphql`
        query NetworkDiagramQuery($degreeZero: ID!){
            Node(id: $degreeZero){
                id
                name
                edges {
                    id
                    name:title
                    nodes {
                        id
                        name
                        edges {
                            id
                            name:title
                        }
                    }
                }
            }
        }
	`, { degreeZero: degreeZero.toString() }, { fetchPolicy: 'store-or-network' });

	const formattedData = useMemo(() => {
		if(nodesAre === 'shows') {
			return networkWranglers.formatSwapped(data);
		}
		if(nodesAre === 'people') {
			return networkWranglers.formatStandard(data);
		}
	}, [data, nodesAre]);

	return (
		<StyledNetworkDiagram data-testid="NetworkDiagram" ref={containerRef}>
			{formattedData && <Network key={nodesAre} formattedData={formattedData} dimensions={dimensions} />}
		</StyledNetworkDiagram>
	);
};
