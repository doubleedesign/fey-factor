import { createContext, FC, PropsWithChildren, useContext, useState, useEffect, useRef } from 'react';
import { MultiValue } from 'react-select';
import { MultiSelectOption } from '../types.ts';
import { useLogs } from '../hooks/use-logs.ts';
import { AlertToast } from '../components/misc/AlertToast/AlertToast.tsx';
import { useResizeObserver } from '../hooks';
import { StyledProviderRoot } from '../components/common.ts';

type VennContextState = {
	selectedRoles: MultiValue<MultiSelectOption>;
	setSelectedRoles: (roles:MultiValue<MultiSelectOption>) => void;
	maxAverageDegree: number;
	setMaxAverageDegree: (degree: number) => void;
	minConnections: number;
	setMinConnections: (connections: number) => void;
};

export const VennContext = createContext({} as VennContextState);

export const VennContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [maxAverageDegree, setMaxAverageDegree] = useState<number>(1.5);
	const [minConnections, setMinConnections] = useState<number>(5);
	const [selectedRoles, setSelectedRoles] = useState<MultiValue<MultiSelectOption>>([]);
	// TODO: Euler switch and limit need to be moved up here so they can be deps for the logger
	const { capturedLogs } = useLogs('/venn-diagram', ['not represented on screen'], [maxAverageDegree, minConnections, selectedRoles], 200);
	const ref = useRef<HTMLDivElement>(null);
	const { width, height } = useResizeObserver(ref, [], 500);
	const [alert, setAlert] = useState<string | null>(null);

	useEffect(() => {
		console.debug('Captured logs in context: ', capturedLogs);
	}, [capturedLogs]);

	useEffect(() => {
		if (width && height && (width < 1440 || height < 800)) {
			setAlert('I know it\'s very 2002 of me to give a browser size warning, but this app is best viewed on a viewport of 1440x800 or larger.');
		}
	}, [height, width]);

	return (
		<StyledProviderRoot ref={ref}>
			<VennContext.Provider
				value={{
					selectedRoles,
					setSelectedRoles,
					maxAverageDegree,
					setMaxAverageDegree,
					minConnections,
					setMinConnections,
				}}
			>
				{children}
			</VennContext.Provider>
			<>
				{alert && (
					<AlertToast onClose={() => setAlert(null)}>
						<p>{alert}</p>
					</AlertToast>
				)}
			</>
		</StyledProviderRoot>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useVennContext = () => {
	const context = useContext(VennContext);
	if (!context) {
		throw new Error('useVennContext must be used within a VennContextProvider');
	}

	return context;
};