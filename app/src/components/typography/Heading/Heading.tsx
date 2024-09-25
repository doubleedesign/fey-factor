import { FC, PropsWithChildren } from 'react';
import { StyledHeading } from './Heading.style';

type HeadingProps = {
	level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export const Heading: FC<PropsWithChildren<HeadingProps>> = ({ level, children }) => {
	return (
		<StyledHeading data-testid="Heading" as={level}>
			{children}
		</StyledHeading>
	);
};
