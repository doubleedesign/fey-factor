import { FC, useMemo } from 'react';
import { VennDiagram as Venn } from 'reaviz';
import { StyledVennDiagramWrapper } from './VennDiagram.style.ts';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { VennDiagramQuery } from '../../__generated__/VennDiagramQuery.graphql.ts';

export const VennDiagram: FC = () => {
	const rawData = useLazyLoadQuery<VennDiagramQuery>(
		graphql`
			query VennDiagramQuery($limit: Int!) {
				TvShows(limit: $limit) {
					id
					title
                    people {
                        id
                        name
                    }
	            }
	        }
		`,
		{ limit: 20 }
	);

	console.log(rawData);

	const formattedData = useMemo(() => {
		if(rawData.TvShows) {
			return rawData.TvShows.map((show) => {
				return {
					key: [show?.id as string ?? ''],
					data: show?.people?.length ?? 0,
				};
			});
		}
	}, [rawData.TvShows]);

	return (
		<StyledVennDiagramWrapper data-testid="VennDiagram">
			{/*{formattedData &&*/}
			{/*	<Venn data={formattedData} />*/}
			{/*}*/}
		</StyledVennDiagramWrapper>
	);
};
