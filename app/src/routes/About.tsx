import { FC } from 'react';
import { PageWrapper, ControlBar, MarkdownContent } from '../components/layout';
import { Heading } from '../components/typography';
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
