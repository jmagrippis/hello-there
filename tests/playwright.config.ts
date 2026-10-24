import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	timeout: process.env.CI ? 60_000 : 30_000,
	fullyParallel: !process.env.CI,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 3 : undefined,
	use: {
		/* Point it to a deployment, to run tests against it! */
		baseURL: process.env.PUBLIC_ROOT_URL || 'http://localhost:5173',
		trace: 'on-first-retry',
		video: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: {...devices['Desktop Chrome']},
		},
		{
			name: 'firefox',
			use: {...devices['Desktop Firefox']},
		},
		{
			name: 'Mobile Safari',
			use: {...devices['iPhone 15 Pro'], contextOptions: {reducedMotion: 'reduce'}},
		},
	],
	webServer: !process.env.PUBLIC_ROOT_URL
		? {
				// the built Worker imports `cloudflare:workers`, so only workerd can serve it
				command: 'vp run preview',
				// this config lives in `tests/`, and Playwright resolves cwd relative
				// to it — without this, `vp preview` runs where there is no app
				cwd: '..',
				port: 5173,
				reuseExistingServer: !process.env.CI,
			}
		: undefined,
})
