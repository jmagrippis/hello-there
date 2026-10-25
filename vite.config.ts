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
				// runs write to their own inputs, so the cache would never hit
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
	// imported inside the callback, so `vp lint` and `vp fmt` never load them
	plugins: lazyPlugins(async () => {
		const [
			{default: tailwindcss},
			{sveltekit},
			{default: adapter},
			{default: Icons},
			{FileSystemIconLoader},
		] = await Promise.all([
			import('@tailwindcss/vite'),
			import('@sveltejs/kit/vite'),
			import('@sveltejs/adapter-cloudflare'),
			import('unplugin-icons/vite'),
			import('unplugin-icons/loaders'),
		])

		return [
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
		]
	}),
	test: {
		include: ['src/**/*.test.ts'],
		mockReset: true,
	},
})
