import React, { FC, PropsWithChildren, ReactNode, useState, useCallback } from 'react';
import { StyledExpandable, StyledExpandableTitle } from './Expandable.style';
import { SingleLineText } from '../../typography/SingleLineText/SingleLineText.tsx';

type ExpandableProps = {
	title: string;
	titleTag?: ReactNode;
};

export const Expandable: FC<PropsWithChildren<ExpandableProps>> = ({ title, titleTag, children }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	// HTML <details> and <summary> do have their own open/close management,
	// but we need to control it manually to keep it in sync with the state
	// so the children are only rendered when open to prevent over-fetching of the data inside them
	const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		setIsOpen(!isOpen);
	}, [isOpen]);

	return (
		<StyledExpandable data-testid="Expandable" open={isOpen}>
			<StyledExpandableTitle data-testid="ExpandableTitle" onClick={handleClick}>
				<span><SingleLineText text={title} /></span>
				<div>{titleTag} <i className="fa-regular fa-plus"></i></div>
			</StyledExpandableTitle>
			<div>
				{/** Only render children when expanded to prevent fetching of data before it's actually needed */}
				{isOpen && (<>{ children }</>)}
			</div>
		</StyledExpandable>
	);
};
