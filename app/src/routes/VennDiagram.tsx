import { FC, Suspense } from 'react';;
import { PageWrapper } from '../components/PageWrapper/PageWrapper.tsx';
import { ControlBar } from '../components/ControlBar/ControlBar.tsx';
import { Heading } from '../components/Heading/Heading.tsx';

export const VennDiagram: FC = () => {

	return (
		<Suspense>
			<PageWrapper>
				<ControlBar>
					<Heading level="h1">Venn Diagram</Heading>
				</ControlBar>

			</PageWrapper>
		</Suspense>
	);
};
