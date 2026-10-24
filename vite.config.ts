import adapter from '@sveltejs/adapter-cloudflare'
import {sveltekit} from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import {FileSystemIconLoader} from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import {defineConfig, lazyPlugins} from 'vite-plus'

import {ogImages} from './scripts/ogImagesPlugin'

export default defineConfig({
	lint: {
		options: {typeAware: true, typeCheck: true},
		rules: {'typescript/no-unused-vars': 'warn'},
	},
	staged: {
		'*.{js,ts,svelte}': 'vp check --fix',
	},
	run: {
		tasks: {
			sanity: {
				command: 'vp check && vp run check && vp test && vp build && vp run playwright',
			},
			playwright: {
				command: 'playwright test --config tests/playwright.config.ts',
				cache: {
					input: [{auto: true}, '!test-results/**', '!.svelte-kit/**', '!.wrangler/**'],
					env: ['PUBLIC_ROOT_URL', 'CI'],
				},
			},
		},
	},
	fmt: {
		svelte: true,
		useTabs: true,
		singleQuote: true,
		semi: false,
		bracketSpacing: false,
		sortTailwindcss: {stylesheet: './src/app.css'},
		sortImports: {},
		ignorePatterns: [
			'pnpm-lock.yaml',
			'.svelte-kit/',
			'.wrangler/',
			'test-results/',
			'.playwright-mcp/',
			// wrangler types owns this and rewrites it in its own style
			'worker-configuration.d.ts',
		],
	},
	plugins: lazyPlugins(() => [
		tailwindcss(),
		ogImages(),
		sveltekit({
			adapter: adapter(),
			compilerOptions: {runes: true, experimental: {async: true}},
			experimental: {remoteFunctions: true},
		}),
		Icons({
			compiler: 'svelte',
			customCollections: {
				brand: FileSystemIconLoader('./src/icons'),
			},
		}),
	]),
	test: {
		include: ['src/**/*.test.ts'],
		mockReset: true,
	},
})
