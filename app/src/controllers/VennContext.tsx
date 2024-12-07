import { createContext, FC, PropsWithChildren, useContext, useState } from 'react';
import { MultiValue } from 'react-select';
import { MultiSelectOption } from '../types.ts';

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