import { MutableRefObject, useState, useEffect } from 'react';

type MutationObserverOptions = {
	attributes: string[];
	watchChildren: boolean;
};

const defaultOptions = {
	attributes: [],
	watchChildren: true,
};

export const useMutationObserver = (ref: MutableRefObject<HTMLElement | null>, deps: unknown[] = [], options: MutationObserverOptions = defaultOptions) => {
	const [mutations, setMutations] = useState<MutationRecord[]>([]);

	useEffect(() => {
		const target = ref.current;
		if (!target) return;

		const observer = new MutationObserver((mutationList) => {
			for (const mutation of mutationList) {
				setMutations((prevMutations) => [...prevMutations, mutation]);
			}
		});

		observer.observe(target, {
			attributes: options.attributes.length > 0,
			attributeFilter: options.attributes.length > 0 ? options.attributes : undefined,
			attributeOldValue: options.attributes.length > 0 ? true : undefined,
			childList: options.watchChildren,
			subtree: options.watchChildren
		});

		// Clean up on unmount
		return () => observer.disconnect();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref, ...deps]);

	return { mutations };
};