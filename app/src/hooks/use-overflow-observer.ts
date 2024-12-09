import { useEffect, useMemo, useState, MutableRefObject, useCallback } from 'react';

type OverflowObserverResult = {
	overflow: number;
};

/**
 * Hook to observe horizontal overflow of an element
 * @param ref
 * @param deps
 * @param debounce
 */
export function useOverflowObserver(
	ref: MutableRefObject<HTMLElement | null>,
	deps: unknown[] = [],
	debounce?: number
): OverflowObserverResult {
	const [overflow, setOverflow] = useState<number>(0);

	const getTotalChildWidth = useCallback((element: HTMLElement, level: number): number => {
		let maxWidth = 0;
		if (level > 3) return 0; // Stop recursion after 3 levels of nested elements

		Array.from(element.children).forEach((child) => {
			const childElement = child as HTMLElement;

			// Compare child width directly
			const childWidth = childElement.getBoundingClientRect().width;

			// Check recursively if the child has nested children
			const nestedChildWidth = getTotalChildWidth(childElement, level + 1);

			maxWidth = Math.max(maxWidth, childWidth, nestedChildWidth);
		});

		return maxWidth;
	}, []);

	const observer = useMemo(() => {
		return new ResizeObserver(() => {
			const timeout = setTimeout(() => {
				const parent = ref.current;

				if (parent) {
					const parentWidth = parent.clientWidth;
					const maxChildWidth = getTotalChildWidth(parent, 1);

					// If any child (direct or nested) exceeds parent width, it's overflowing
					setOverflow(Math.floor(maxChildWidth - parentWidth));
				}
			}, debounce || 0);

			return () => clearTimeout(timeout);
		});
	}, [debounce, getTotalChildWidth, ref]);

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

	return { overflow };
}