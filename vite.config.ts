import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [react()],
	// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
	build: {
		dynamicImportVarsOptions: {
			exclude: [],
		},
	},
	// https://www.asobou.co.jp/blog/web/github-pages
	base:
		process.env.NODE_ENV === 'production'
			? '/<GITHUB_REPOSITORY_NAME>/'
			: './',
});
