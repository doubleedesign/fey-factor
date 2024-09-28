import { FC, PropsWithChildren } from 'react';
import { StyledExpandable, StyledExpandableTitle } from './Expandable.style';

type ExpandableProps = {
	title: string;
	isExpanded?: boolean;
};

export const Expandable: FC<PropsWithChildren<ExpandableProps>> = ({ title, isExpanded = false, children }) => {
	return (
		<StyledExpandable data-testid="Expandable" open={isExpanded}>
			<StyledExpandableTitle data-testid="ExpandableTitle">
				{title}
				<i className="fa-regular fa-plus"></i>
			</StyledExpandableTitle>
			<div>
				{children}
			</div>
		</StyledExpandable>
	);
};
