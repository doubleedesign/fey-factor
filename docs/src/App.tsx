import { useState, useMemo } from 'react';
import { dbEntities, gqlEntities } from './controllers/schema-objects.ts';
import { ReactFlowProvider } from '@xyflow/react';
import { SchemaDiagramWrapper } from './components/SchemaDiagramWrapper/SchemaDiagramWrapper.tsx';
import { DiagramContextProvider } from './context/DiagramContext.tsx';
import '@xyflow/react/dist/style.css';

function App() {
	const [selected, setSelected] = useState<'database' | 'graphql'>('database');

	const entities = useMemo(() => {
		return selected === 'database' ? dbEntities : gqlEntities;
	}, [selected]);

	return (
		<ReactFlowProvider>
			<DiagramContextProvider selected={selected} setSelected={setSelected}>
				<SchemaDiagramWrapper entities={entities} format={selected} />
			</DiagramContextProvider>
		</ReactFlowProvider>
	);
}

export default App;
