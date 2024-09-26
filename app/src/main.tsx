import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RelayEnvironmentProvider } from 'react-relay';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import environment from './relayEnvironment.ts';
import './global.css';
import { ThemeProvider } from 'styled-components';
import theme from './theme.ts';
import { Rankings, Network, VennDiagram, About, ErrorPage } from './routes';
import { GlobalHeader } from './components/layout';
import { GlobalFooter } from './components/layout/GlobalFooter/GlobalFooter.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RelayEnvironmentProvider environment={environment}>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<GlobalHeader />
					<Routes>
						<Route path="/" element={<Rankings />} />
						<Route path="/network" element={<Network />} />
						<Route path="/venn-diagram" element={<VennDiagram />} />
						<Route path="/about" element={<About />} />
						<Route path="*" element={<ErrorPage/>} />
					</Routes>
					<GlobalFooter />
				</BrowserRouter>
			</ThemeProvider>
		</RelayEnvironmentProvider>
	</StrictMode>,
);
