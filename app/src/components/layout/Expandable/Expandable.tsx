import { FC, PropsWithChildren, ReactNode } from 'react';
import { StyledExpandable, StyledExpandableTitle } from './Expandable.style';
import { SingleLineText } from '../../typography/SingleLineText/SingleLineText.tsx';

type ExpandableProps = {
	title: string;
	titleTag?: ReactNode;
	isExpanded?: boolean;
};

export const Expandable: FC<PropsWithChildren<ExpandableProps>> = ({ title, titleTag, isExpanded = false, children }) => {
	return (
		<StyledExpandable data-testid="Expandable" open={isExpanded}>
			<StyledExpandableTitle data-testid="ExpandableTitle">
				<span><SingleLineText text={title} /></span>
				<div>{titleTag} <i className="fa-regular fa-plus"></i></div>
			</StyledExpandableTitle>
			<div>
				{children}
			</div>
		</StyledExpandable>
	);
};
