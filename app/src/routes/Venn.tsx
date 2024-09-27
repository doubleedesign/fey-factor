import { FC, Suspense } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { VennDiagram } from '../page-content';

export const Venn: FC = () => {
	
	return (
		<Suspense>
			<PageWrapper fullwidth>
				<ControlBar withContainer>
					<div>
						<Heading level="h1">Venn Diagram</Heading>
						<LeadParagraph>The idea that started it all</LeadParagraph>
					</div>
				</ControlBar>
				<VennDiagram />
			</PageWrapper>
		</Suspense>
	);
};
