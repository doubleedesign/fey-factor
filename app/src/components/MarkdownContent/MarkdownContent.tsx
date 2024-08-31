import { FC, type ReactNode } from 'react';
import { StyledMarkdownContent } from './MarkdownContent.style';

type MarkdownWrapperProps = {
	markdown: (props: any) => ReactNode;
};

export const MarkdownContent: FC<MarkdownWrapperProps> = ({ markdown }) => {
	return (
		<StyledMarkdownContent data-testid="MarkdownWrapper">
			{markdown({})}
		</StyledMarkdownContent>
	);
};
