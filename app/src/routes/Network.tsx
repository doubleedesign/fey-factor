import { FC } from 'react';
import { ControlBar, PageWrapper } from '../components/layout';
import { Heading, LeadParagraph } from '../components/typography';
import { NetworkDiagram } from '../page-content/NetworkDiagram/NetworkDiagram.tsx';
import { RelayComponentWrapper } from '../components/wrappers/RelayComponentWrapper/RelayComponentWrapper.tsx';

export const Network: FC = () => {
	return (
		<PageWrapper>
			<ControlBar>
				<div>
					<Heading level="h1">Network Diagram</Heading>
					<LeadParagraph>Follow the connection paths visually</LeadParagraph>
				</div>
			</ControlBar>
			<RelayComponentWrapper>
				<NetworkDiagram />
			</RelayComponentWrapper>
		</PageWrapper>
	);
};
