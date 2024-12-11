import { FC, PropsWithChildren } from 'react';
import { StyledDetailPanel } from './DetailPanel.style.ts';

type DetailPanelProps = PropsWithChildren & {
	height?: number;
};

export const DetailPanel: FC<DetailPanelProps> = ({ height, children }) => {

	return (
		<StyledDetailPanel data-testid="VennDetailPanel" $height={height}>
			{children}
		</StyledDetailPanel>
	);
};
