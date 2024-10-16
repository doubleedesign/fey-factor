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

// Suppress warning about defaultProps coming from Reaviz because it's annoying and I don't care
const originalConsoleError = console.error;
console.error = (...args) => {
	if (typeof args[0] === 'string' && args[0].includes('Support for defaultProps will be removed')) {
		return;
	}
	originalConsoleError(...args);
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RelayEnvironmentProvider environment={environment}>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<GlobalHeader />
					<RankingContextProvider>
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/rankings" element={<Rankings />} />
							<Route path="/network" element={<Network />} />
							<Route path="/venn-diagram" element={<Venn />} />
							<Route path="/about" element={<About />} />
							<Route path="*" element={<ErrorPage/>} />
						</Routes>
					</RankingContextProvider>
					<GlobalFooter />
				</BrowserRouter>
			</ThemeProvider>
		</RelayEnvironmentProvider>
	</StrictMode>,
);
