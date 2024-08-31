import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RelayEnvironmentProvider } from 'react-relay';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import environment from './relayEnvironment.ts';
import './global.css';
import { ThemeProvider } from 'styled-components';
import theme from './theme.ts';
import App from './App.tsx';
import { Rankings, Network, VennDiagram, About, ErrorPage } from './routes';
import { GlobalHeader } from './components/GlobalHeader/GlobalHeader.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RelayEnvironmentProvider environment={environment}>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<GlobalHeader />
					<Routes>
						<Route path="/" element={<App />} />
						<Route path="/rankings" element={<Rankings />} />
						<Route path="/network" element={<Network />} />
						<Route path="/venn-diagram" element={<VennDiagram />} />
						<Route path="/about" element={<About />} />
						<Route path="*" element={<ErrorPage/>} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</RelayEnvironmentProvider>
	</StrictMode>,
);
