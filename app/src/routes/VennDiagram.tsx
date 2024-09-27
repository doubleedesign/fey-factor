import { FC, Suspense } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { Container } from '../components/common.ts';
import { VennDiagram as Venn } from 'reaviz';

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
				<Container>
					<Venn
						height={300}
						width={300}
						data={[
							{ key: ['A'], data: 12 },
							{ key: ['B'], data: 12 },
							{ key: ['A', 'B'], data: 2 }
						]}
					/>
				</Container>
			</PageWrapper>
		</Suspense>
	);
};
