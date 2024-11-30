import { FC } from 'react';
import { StyledVenn } from './Venn.style';
import { VennDiagram, type VennDiagramData } from 'reaviz';

type VennProps = {
	data: VennDiagramData[];
};

export const Venn: FC<VennProps> = ({ data }) => {

	return (
		<StyledVenn data-testid="Venn">
			<VennDiagram height={2000} width={2000} data={data} />
		</StyledVenn>
	);
};
