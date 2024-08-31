import { FC } from 'react';
import { PageWrapper } from '../components/PageWrapper/PageWrapper.tsx';
import { Heading } from '../components/Heading/Heading.tsx';
import { ControlBar } from '../components/ControlBar/ControlBar.tsx';
import { MarkdownContent } from '../components/MarkdownContent/MarkdownContent.tsx';
import content from '../content/About.mdx';

export const About: FC = () => {

	return (
		<PageWrapper>
			<ControlBar>
				<Heading level="h1">About</Heading>
			</ControlBar>
			<MarkdownContent markdown={content} />
		</PageWrapper>
	);
};
