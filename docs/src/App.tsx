import { useState, useMemo } from 'react';
import { dbEntities, gqlEntities } from './controllers/schema-objects.ts';
import { SchemaDiagram } from './components/SchemaDiagram.tsx';
import { ControlBar } from './components/ControlBar/ControlBar.tsx';
import { SwapButton } from './components/SwapButton/SwapButton.tsx';
import '@xyflow/react/dist/style.css';

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
			<SchemaDiagram entities={entities} format={selected} />
		</>
	);
}

export default App;
