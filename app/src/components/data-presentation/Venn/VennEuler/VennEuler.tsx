import { FC } from 'react';
import { createVennJSAdapter, VennDiagram, VennDiagramProps } from '@upsetjs/react';
import { layout } from '@upsetjs/venn.js';
import { StyledEulerVennWrapper } from './VennEuler.style.ts';

type EulerProps = VennDiagramProps;

export const VennEuler: FC<EulerProps> = (props) => {

	return (
		<StyledEulerVennWrapper data-test-id="EulerVennWrapper">
			{/** @ts-expect-error TS2786: VennDiagram cannot be used as a JSX component */}
			<VennDiagram
				layout={createVennJSAdapter(layout)}
				{...props}
			/>
		</StyledEulerVennWrapper>
	);
};

// Default export for lazy-loading in Venn.tsx
export default VennEuler;