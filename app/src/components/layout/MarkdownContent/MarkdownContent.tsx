import { FC, type ReactNode } from 'react';
import { MDXProvider, useMDXComponents } from '@mdx-js/react';
import { StyledMarkdownContent } from './MarkdownContent.style';

type MarkdownWrapperProps = {
	markdown: () => ReactNode;
};

export const MarkdownContent: FC<MarkdownWrapperProps> = ({ markdown }) => {
	const components = useMDXComponents();

	return (
		<StyledMarkdownContent data-testid="MarkdownWrapper">
			<MDXProvider components={components}>
				{markdown()}
			</MDXProvider>
		</StyledMarkdownContent>
	);
};