import { Children, FC, PropsWithChildren } from 'react';
import { StyledVennResultAccordion } from './VennResultAccordion.style';
import differenceBy from 'lodash/differenceBy';
import { Expandable } from '../../../layout';

type VennResultAccordionProps = PropsWithChildren & {
	defaultOpen?: string;
	itemMaxHeight?: number;
};

export const VennResultAccordion: FC<VennResultAccordionProps> = ({ defaultOpen, itemMaxHeight, children }) => {
	const childrenWithLabels = Children.toArray(children).filter((child) => {
		// @ts-ignore
		return child?.props?.label;
	});

	const childrenWithoutLabels = differenceBy(Children.toArray(children), childrenWithLabels, 'props.label');

	return (
		<StyledVennResultAccordion data-testid="VennResults">
			{childrenWithLabels.map((child) => {
				// @ts-ignore
				const label = child?.props?.label;

				return (
					<Expandable
						key={label}
						title={label}
						fetchesData={false}
						defaultOpen={label === defaultOpen}
						appearance="shadow"
						scrollable={true}
						maxHeight={itemMaxHeight}
					>
						{child}
					</Expandable>
				);
			})}
			{childrenWithoutLabels}
		</StyledVennResultAccordion>
	);
};
