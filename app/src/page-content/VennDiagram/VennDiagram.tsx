import { FC, useMemo } from 'react';
import { VennDiagram as Venn } from 'reaviz';
import { StyledVennDiagramWrapper } from './VennDiagram.style.ts';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { VennDiagramQuery } from '../../__generated__/VennDiagramQuery.graphql.ts';

export const VennDiagram: FC = () => {
	const rawData = useLazyLoadQuery<VennDiagramQuery>(
		graphql`
			query VennDiagramQuery {
				TvShows {
					id
					title
                    people {
                        id
                        name
                    }
	            }
	        }
		`, {}
	);

	const formattedData = useMemo(() => {
		if(rawData.TvShows) {
			return rawData.TvShows.map((show) => {
				return {
					key: [show?.id as string ?? ''],
					data: show?.people?.length ?? 0,
				};
			});
		}
	}, [rawData]);

	return (
		<StyledVennDiagramWrapper data-testid="VennDiagram">
			{formattedData &&
				<Venn data={formattedData} />
			}
		</StyledVennDiagramWrapper>
	);
};
