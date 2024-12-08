import { FC, PropsWithChildren, useRef, useMemo } from 'react';
import { StyledVennPositionHandler } from './VennPositionHandler.style';
import { useResizeObserver, useOverflowObserver } from '../../../../hooks';

type VennPositionHandlerProps = PropsWithChildren;

export const VennPositionHandler: FC<VennPositionHandlerProps> = ({ children }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { width } = useResizeObserver(ref, [ref.current], 300);
	const { overflow } = useOverflowObserver(ref, [width, ref.current], 500);

	// If the diagram has overflow and there is space to the left, shift it over
	const cssTransform = useMemo(() => {
		const boundingBox = ref.current?.getBoundingClientRect();
		const spaceToLeft = boundingBox ? boundingBox.left : 0;

		if(overflow > 50 && spaceToLeft > 50) {
			return spaceToLeft >= overflow ? `translateX(-${overflow}px)` : `translateX(-${spaceToLeft}px)`;
		}
	}, [overflow]);

	return (
		<StyledVennPositionHandler
			data-testid="VennPositionHandler"
			ref={ref}
			$transform={cssTransform}
		>
			{children}
		</StyledVennPositionHandler>
	);
};
