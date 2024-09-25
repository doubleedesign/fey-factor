import { FC, Suspense } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';

export const VennDiagram: FC = () => {

	return (
		<Suspense>
			<PageWrapper>
				<ControlBar>
					<div>
						<Heading level="h1">Venn Diagram</Heading>
						<LeadParagraph>The idea that started it all</LeadParagraph>
					</div>
				</ControlBar>

			</PageWrapper>
		</Suspense>
	);
};
