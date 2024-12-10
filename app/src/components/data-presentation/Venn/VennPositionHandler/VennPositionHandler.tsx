import { FC, useRef, ReactElement } from 'react';
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
	const { width, height } = useResizeObserver(ref, [ref.current], 300, true);

	return (
		<StyledVennPositionHandler
			data-testid="VennPositionHandler"
			ref={ref}
		>
			<StyledVennPositionContent>
				{/** @ts-expect-error TS2349: This expression is not callable. Not all constituents of type 'ReactElement' are callable. */}
				{children({ width, height })}
			</StyledVennPositionContent>
		</StyledVennPositionHandler>
	);
};
