import React, { FC, PropsWithChildren, ReactNode, useState, useRef, useCallback, useEffect } from 'react';
import { StyledExpandable, StyledExpandableContent, StyledExpandableTitle } from './Expandable.style';
import { SingleLineText } from '../../typography/SingleLineText/SingleLineText.tsx';
import { useMutationObserver } from '../../../hooks';

type ExpandableProps = {
	title: string;
	titleTag?: ReactNode;
	fetchesData?: boolean;
	defaultOpen?: boolean;
	appearance?: 'default' | 'shadow';
	scrollable?: boolean; // Note: maxHeight also needs to be set
	maxHeight?: number;
};

export const Expandable: FC<PropsWithChildren<ExpandableProps>> = ({
	title,
	titleTag,
	fetchesData,
	defaultOpen,
	appearance = 'default',
	scrollable = false,
	maxHeight = undefined,
	children
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(defaultOpen || false);
	const labelRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const innerContentRef = useRef<HTMLDivElement>(null);
	const [minHeight, setMinHeight] = useState<number>(labelRef?.current?.scrollHeight ?? 0); // min height for the inner content
	const { mutations } = useMutationObserver(innerContentRef, [isOpen]);
	const MIN_CLOSED_HEIGHT = 32;

	// HTML <details> and <summary> do have their own open/close management,
	// but we need to control it manually to keep it in sync with the state
	// so the children are only rendered when open to prevent over-fetching of the data inside them
	// (also, for CSS transitions)
	const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		setIsOpen(!isOpen);
	}, [isOpen]);

	// When open, capture the height of the content
	// This is for the cases where the content is not rendered until first opening so the true scrollHeight is not available until then
	const handleHeight = useCallback(() => {
		if (fetchesData && isOpen && contentRef.current) {
			setMinHeight(contentRef.current.scrollHeight);
		}
	}, [fetchesData, isOpen]);

	// For cases where content is not rendered until opened, the handleHeight function will initially capture the height of the loading skeleton,
	// so we need to handle the height changing when the content finishes loading.
	// This does this by detecting mutations in the inner content div and updating the height accordingly
	useEffect(() => {
		if (fetchesData && mutations.length > 0 && innerContentRef?.current) {
			setMinHeight(innerContentRef?.current?.scrollHeight);
		}
	}, [fetchesData, mutations, handleHeight]);

	const getClosedHeight = useCallback(() => {
		if(labelRef?.current?.parentElement) {
			const styles = window.getComputedStyle(labelRef?.current?.parentElement);

			return labelRef?.current?.scrollHeight + parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
		}
	}, []);

	const getOpenHeight = useCallback(() => {
		const calcHeight = (labelRef?.current?.scrollHeight ?? MIN_CLOSED_HEIGHT) + (contentRef?.current?.scrollHeight ?? 0) + 16;

		if(maxHeight && calcHeight > maxHeight) {
			return maxHeight + MIN_CLOSED_HEIGHT;
		}

		return calcHeight;
	}, [maxHeight]);

	return (
		<StyledExpandable
			data-testid="Expandable"
			open={isOpen} 
			$height={isOpen
				? getOpenHeight()
				: getClosedHeight()
			}
			onTransitionEnd={handleHeight}
			$appearance={appearance}
		>
			<StyledExpandableTitle
				data-testid="ExpandableTitle"
				ref={labelRef}
				onClick={handleClick}
			>
				<span><SingleLineText text={title} /></span>
				<div>{titleTag} <i className="fa-regular fa-plus"></i></div>
			</StyledExpandableTitle>
			<StyledExpandableContent
				data-testid="ExpandableContent"
				ref={contentRef}
				$height={fetchesData ? minHeight : 'auto'}
				$scrollable={scrollable}
				$maxHeight={maxHeight}
			>
				{fetchesData ? (
					<div ref={innerContentRef}>
						{/** Only render children when expanded to prevent fetching of data before it's actually needed */}
						{isOpen && (<>{ children }</>)}
					</div>
				) : (
					<div>{ children }</div>
				)}
			</StyledExpandableContent>
		</StyledExpandable>
	);
};
