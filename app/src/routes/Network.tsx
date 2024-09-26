import { FC, Suspense } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';


export const Network: FC = () => {

	return (
		<Suspense>
			<PageWrapper>
				<ControlBar>
					<div>
						<Heading level="h1">Network Diagram</Heading>
						<LeadParagraph>Follow the connection paths visually</LeadParagraph>
					</div>
				</ControlBar>

			</PageWrapper>
		</Suspense>
	);
};
