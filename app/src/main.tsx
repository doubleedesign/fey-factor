import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RelayEnvironmentProvider } from 'react-relay';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import environment from './relayEnvironment.ts';
import { Dashboard, Rankings, Network, Venn, About, ErrorPage } from './routes';
import { GlobalHeader } from './components/layout';
import { GlobalFooter } from './components/layout/GlobalFooter/GlobalFooter.tsx';
import { RankingContextProvider } from './controllers/RankingContext.tsx';
import { ThemeProvider } from 'styled-components';
import theme from './theme.ts';
import './global.css';
import { VennContextProvider } from './controllers/VennContext.tsx';

// Suppress or capture some console logs/warnings/errors
// Note: There's more of these in the VennContextProvider
const originalConsoleError = console.error;
console.error = (...args) => {
	// Suppress warning about defaultProps coming from Reaviz because it's annoying and I don't care
	if (typeof args[0] === 'string' && args[0].includes('Support for defaultProps will be removed')) {
		return;
	}

	// TODO: I guess I should probably fix this by giving everything unique IDs at the GraphQL server level
	//  but I don't really want to add that complexity unless it actually becomes a problem
	if(typeof args[0] === 'string' && args[0].includes('Warning: RelayModernRecord: Invalid record update, expected both versions of record')) {
		return;
	}
	
	originalConsoleError(...args);
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RelayEnvironmentProvider environment={environment}>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<RankingContextProvider>
						<VennContextProvider>
							<GlobalHeader />
							<Routes>
								<Route path="/" element={<Dashboard />} />
								<Route path="/rankings" element={<Rankings />} />
								<Route path="/network" element={<Network />} />
								<Route path="/venn-diagram" element={<Venn />} />
								<Route path="/about" element={<About />} />
								<Route path="*" element={<ErrorPage/>} />
							</Routes>
							<GlobalFooter />
						</VennContextProvider>
					</RankingContextProvider>
				</BrowserRouter>
			</ThemeProvider>
		</RelayEnvironmentProvider>
	</StrictMode>,
);
