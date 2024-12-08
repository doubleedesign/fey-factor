import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import uniq from 'lodash/uniq';

type LogsHookResult = {
	capturedLogs: string[];
};

/**
 * Intercepts console logs from packages so they can be used in the app
 * @param route - the route to capture logs on
 * @param logTextToCapture - strings to look for in the logs
 * @param deps - dependencies to watch for changes to re-run the hook
 * @param captureDuration - how long to capture logs for (to help prevent unnecessary repetition)
 */
export const useLogs = (route: string, logTextToCapture: string[], deps: any[] = [], captureDuration: number = 1000): LogsHookResult => {
	const location = useLocation();
	const logsRef = useRef<string[]>([]);
	const [result, setResult] = useState<string[]>([]);

	useEffect(() => {
		logsRef.current = [];
		setResult([]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps]);

	useEffect(() => {
		// Only proceed if current route matches and we have text to capture
		if (location.pathname !== route || logTextToCapture.length === 0) return;
		const originalConsoleLog = console.log;

		// Override console.log
		console.log = (...args: any[]) => {
			const logString = args.toString();
			if (logTextToCapture.some((text) => logString.includes(text))) {
				logsRef.current.push(logString);
			}
			else {
				// Use the stored original console.log
				originalConsoleLog(...args);
			}
		};

		const timer = setTimeout(() => {
			const uniqueLogs = uniq(logsRef.current);
			setResult(uniqueLogs);

			// Original console.log is not restored here so that unwanted logs are discarded after the capture duration
			// If this causes unexpected lack of logs, try using console.debug instead to bypass this
		}, captureDuration);

		// Cleanup on unmount
		return () => {
			clearTimeout(timer);
			console.log = originalConsoleLog;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps]);

	return { capturedLogs: result };
};