import { FC, PropsWithChildren, Children } from 'react';
import differenceBy from 'lodash/differenceBy';
import { StyledVennDetailPanel } from './VennDetailPanel.style';
import { Expandable } from '../../../layout';

type VennDetailPanelProps = PropsWithChildren & {
	defaultOpen?: string;
};

export const VennDetailPanel: FC<VennDetailPanelProps> = ({ children, defaultOpen }) => {
	const childrenWithLabels = Children.toArray(children).filter((child) => {
		// @ts-ignore
		return child?.props?.label;
	});

	const childrenWithoutLabels = differenceBy(Children.toArray(children), childrenWithLabels, 'props.label');

	return (
		<StyledVennDetailPanel data-testid="VennDetailPanel">
			{childrenWithLabels.map((child) => {
				// @ts-ignore
				const label = child?.props?.label;

				return (
					<Expandable key={label} title={label} fetchesData={false} defaultOpen={label === defaultOpen} appearance="shadow">
						{child}
					</Expandable>
				);
			})}
			{childrenWithoutLabels}
		</StyledVennDetailPanel>
	);
};
