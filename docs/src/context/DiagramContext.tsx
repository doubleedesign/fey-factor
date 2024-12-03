import { FC, PropsWithChildren, createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Rect, useReactFlow, type Viewport } from '@xyflow/react';
import { SwapButton } from '../components/Buttons/SwapButton/SwapButton.tsx';
import { ResetButton } from '../components/Buttons/ResetButton/ResetButton.tsx';
import { ControlBar } from '../components/ControlBar/ControlBar.tsx';

type DiagramContextValue = {
	bounds: Rect | null;
	setBounds: (bounds: Rect) => void;
	onInit: () => void;
};

const DiagramContext = createContext<DiagramContextValue>({
	bounds: { x: 0, y: 0, width: 0, height: 0 },
	setBounds: () => {},
	onInit: () => {},
});

export const useDiagramContext = () => useContext(DiagramContext);

type DiagramContextProviderProps = {
	selected: 'database' | 'graphql';
	setSelected: (selected: 'database' | 'graphql') => void;
};

export const DiagramContextProvider: FC<PropsWithChildren<DiagramContextProviderProps>> = ({ selected, setSelected, children }) => {
	const { fitView, fitBounds, getViewport, setViewport } = useReactFlow();
	const [bounds, setBounds] = useState<Rect | null>(null);
	const [initialised, setInitialised] = useState(false);
	const [view, setView] = useState<Viewport>(getViewport());

	const onInit = useCallback(() => {
		fitView({ padding: 0.25 }).then(() => {
			setInitialised(true);
			setView(getViewport());
		});
	}, [fitView]);

	useEffect(() => {
		if(initialised && bounds) {
			fitBounds(bounds).then(() => setViewport(view).then());
		}
	}, [bounds, initialised]);


	const swapSchema = () => {
		setSelected(selected === 'database' ? 'graphql' : 'database');
	};

	const resetView = () => {
		setInitialised(false);
		fitView().then();
	};

	return (
		<DiagramContext.Provider value={{ bounds, setBounds, onInit }}>
			<ControlBar>
				<span>Currently showing:&nbsp;
					<strong>{selected === 'database'
						? 'Postgres database schema'
						: 'GraphQL schema'}
					</strong>
				</span>
				<SwapButton onClick={swapSchema}/>
				<ResetButton onClick={resetView}/>
			</ControlBar>
			{children}
		</DiagramContext.Provider>
	);
};
