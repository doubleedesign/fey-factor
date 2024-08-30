import { startTransition, useCallback, useState } from 'react';
import { NumberPicker } from './components/NumberPicker/NumberPicker.tsx';
import { TvShowRankings } from './components/TvShowRankings/TvShowRankings.tsx';
import { ControlBar } from './components/ControlBar/ControlBar.tsx';

function App() {
	const [limit, setLimit] = useState<number>(20);

	const handleLimitChange = useCallback((newLimit: number) => {
		startTransition(() => {
			setLimit(newLimit);
		});
	}, []);

	return (
		<>
			<ControlBar>
				<h1>TV Show Rankings</h1>
				<NumberPicker defaultValue={20} onChange={handleLimitChange} />
			</ControlBar>
			<TvShowRankings limit={limit} />
		</>
	);
}

export default App;
