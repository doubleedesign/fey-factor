import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import relay from 'vite-plugin-relay';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		// Wrap the MDX plugin with enforce property
		{
			...mdx({
				remarkPlugins: [remarkGfm],
			}),
			enforce: 'pre', // Ensure MDX processing happens first
		},
		react(),
		relay,
	],
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx'], // Add MD and MDX file support
	},
});
