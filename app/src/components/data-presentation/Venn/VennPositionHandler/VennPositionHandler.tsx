import { FC, ReactElement, useRef, useState, useEffect } from 'react';
import { StyledVennPositionContent, StyledVennPositionHandler } from './VennPositionHandler.style';
import { useResizeObserver } from '../../../../hooks';

type Dimensions = {
	width: number;
	height: number;
};

type VennPositionHandlerProps = {
	children: ((dimensions: Dimensions) => ReactElement) | ReactElement;
};

export const VennPositionHandler: FC<VennPositionHandlerProps> = ({ children }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [stableDimensions, setStableDimensions] = useState<Dimensions>({ width: 0, height: 0 });
	const { width, height } = useResizeObserver(ref, [ref.current], 300, 'contentRect');

	// Only update dimensions when there's a significant change
	// (arbitrary threshold to help prevent unnecessary re-renders)
	useEffect(() => {
		const THRESHOLD = 100;
		if (
			Math.abs(width - stableDimensions.width) > THRESHOLD ||
			Math.abs(height - stableDimensions.height) > THRESHOLD
		) {
			setStableDimensions({ width, height });
		}
	}, [width, height, stableDimensions]);

	return (
		<StyledVennPositionHandler
			data-testid="VennPositionHandler"
			ref={ref}
		>
			<StyledVennPositionContent>
				{typeof children === 'function'
					? children(stableDimensions)
					: children}
			</StyledVennPositionContent>
		</StyledVennPositionHandler>
	);
};