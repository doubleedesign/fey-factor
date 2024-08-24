import { useState, useMemo } from 'react';
import { dbEntities, gqlEntities } from './controllers/schema-objects.ts';
import { ControlBar } from './components/ControlBar/ControlBar.tsx';
import { SwapButton } from './components/SwapButton/SwapButton.tsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SchemaDiagramWrapper } from './components/SchemaDiagramWrapper/SchemaDiagramWrapper.tsx';

function App() {
	const [selected, setSelected] = useState<'database' | 'graphql'>('graphql');

	const swapSchema = () => {
		setSelected(selected === 'database' ? 'graphql' : 'database');
	};

	const entities = useMemo(() => {
		return selected === 'database' ? dbEntities : gqlEntities;
	}, [selected]);

	return (
		<>
			<ControlBar>
				<span>Currently showing: <strong>{selected}</strong></span>
				<SwapButton onClick={swapSchema}></SwapButton>
			</ControlBar>
			<TransitionGroup style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
				<CSSTransition
					key={selected}
					timeout={300}
					classNames="crossfade"
				>
					<ReactFlowProvider>
						<SchemaDiagramWrapper entities={entities} format={selected} />
					</ReactFlowProvider>
				</CSSTransition>
			</TransitionGroup>
		</>
	);
}

export default App;
