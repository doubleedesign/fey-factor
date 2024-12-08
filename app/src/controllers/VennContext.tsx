import { createContext, FC, PropsWithChildren, useContext, useState, useEffect } from 'react';
import { MultiValue } from 'react-select';
import { MultiSelectOption } from '../types.ts';
import { useLogs } from '../hooks/use-logs.ts';

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

	useEffect(() => {
		console.debug('Captured logs in context: ', capturedLogs);
	}, [capturedLogs]);

	return (
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