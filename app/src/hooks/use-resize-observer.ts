import { MutableRefObject, useMemo, useEffect, useState } from 'react';

interface Dimensions {
	width: number;
	height: number;
}

export function useResizeObserver(ref: MutableRefObject<HTMLElement | null>, deps: unknown[], debounce?: number): Dimensions {
	const [width, setWidth] = useState<number>(0);
	const [height, setHeight] = useState<number>(0);

	const observer = useMemo(() => {
		return new ResizeObserver((entries) => {
			// Using the scrollWidth and scrollHeight of the target ensures this works with CSS transitions
			// because it accounts for the height of the content before it's visually fully expanded, which elements[0].contentRect does not.
			setTimeout((() => {
				setHeight(entries[0].target.scrollHeight);
				// Checking the contentRect width solves the issue of the scrollWidth only changing when it gets wider for cytoscape elements
				if(entries[0].contentRect.width  < entries[0].target.scrollWidth) {
					setWidth(entries[0].contentRect.width);
				}
				else {
					setWidth(entries[0].target.scrollWidth);
				}
			}), debounce || 0);
		});
	}, [debounce]);

	useEffect(() => {
		const target = ref.current;

		if (target) {
			observer.observe(target);
		}

		// Cleanup on unmount
		return () => {
			if (target) {
				observer.unobserve(target);
			}
		};
	}, [deps, observer, ref]);

	return { width, height };
}