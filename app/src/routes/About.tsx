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
			{/** @ts-expect-error TS2322: Type (props: MDXProps) => Element is not assignable to type () => ReactNode */}
			<MarkdownContent markdown={content} />
		</PageWrapper>
	);
};
