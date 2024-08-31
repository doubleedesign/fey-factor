import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import relay from 'vite-plugin-relay';
import mdx from '@mdx-js/rollup';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		relay,
		mdx(),
	],
});
