import { FC } from 'react';
import { VennDiagramElement } from '../../../../types.ts';
import { StyledVennDetailPanel } from './VennDetailPanel.style';

type VennDetailPanelProps = {
	data: VennDiagramElement | null;
};

export const VennDetailPanel: FC<VennDetailPanelProps> = () => {
	return (
		<StyledVennDetailPanel data-testid="VennDetailPanel">
			VennDetailPanel Component
		</StyledVennDetailPanel>
	);
};
