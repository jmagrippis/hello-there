import adapter from '@sveltejs/adapter-cloudflare'
import {sveltekit} from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import {FileSystemIconLoader} from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import {defineConfig, lazyPlugins} from 'vite-plus'

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
				// a run writes to its own inputs, so it would never hit the cache anyway
				cache: false,
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
		sveltekit({
			adapter: adapter(),
			compilerOptions: {runes: true},
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
