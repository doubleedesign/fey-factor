import { FC, useRef, useMemo, ReactElement } from 'react';
import { StyledVennPositionHandler } from './VennPositionHandler.style';
import { useResizeObserver, useOverflowObserver } from '../../../../hooks';

type Dimensions = {
	width: number;
	height: number;
};

type VennPositionHandlerProps = {
	children: ((dimensions: Dimensions) => ReactElement) | ReactElement;
};

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
			{/** @ts-expect-error TS2349: This expression is not callable. Not all constituents of type 'ReactElement' are callable. */}
			{children({ width, height: ref?.current?.clientHeight < 800 ? ref.current.clientHeight : 800 })}
		</StyledVennPositionHandler>
	);
};
