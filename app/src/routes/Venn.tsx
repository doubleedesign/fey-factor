import { FC, Suspense } from 'react';
import { VennDiagram } from '../page-content';

export const Venn: FC = () => {

	return (
		<Suspense>
			<VennDiagram />
		</Suspense>
	);
};
