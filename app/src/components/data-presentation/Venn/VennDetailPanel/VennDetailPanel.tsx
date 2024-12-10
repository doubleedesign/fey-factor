import { FC, PropsWithChildren } from 'react';
import { StyledVennDetailPanel } from './VennDetailPanel.style';

type VennDetailPanelProps = PropsWithChildren ;

export const VennDetailPanel: FC<VennDetailPanelProps> = ({ children }) => {

	return (
		<StyledVennDetailPanel data-testid="VennDetailPanel">
			{children}
		</StyledVennDetailPanel>
	);
};
