import {expect, test} from '@playwright/test'

test('every admin page and action asks for a password', async ({request, baseURL}) => {
	const sameOrigin = {origin: new URL(baseURL ?? '').origin}

	const responses = await Promise.all([
		request.get('/admin'),
		request.get('/admin/Zarina'),
		request.post('/admin/Zarina?/delete', {form: {}, headers: sameOrigin}),
		request.post('/admin?/pool', {form: {name: 'Zarina', include: 'true'}, headers: sameOrigin}),
	])

	for (const response of responses) {
		expect(response.status()).toBe(401)
		expect(response.headers()['www-authenticate']).toMatch(/^Basic /)
	}
})

test.describe('as the admin', () => {
	test.use({
		httpCredentials: {
			username: process.env.ADMIN_USERNAME ?? '',
			password: process.env.ADMIN_PASSWORD ?? '',
		},
	})

	test('handcrafts a greeting, features it in the random pool, then hands the name back to Claude', async ({
		page,
	}) => {
		const name = `José ${Date.now().toString(36).slice(-6)}`
		const path = `/${encodeURIComponent(name)}`

		await page.goto('/admin')
		await expect(page.getByTestId('hydrated')).toBeVisible()

		await page.getByRole('searchbox', {name: 'Name'}).fill(name)
		await page.getByRole('button', {name: 'Search'}).click()
		await page.getByRole('link', {name: `Write a greeting for “${name}”`}).click()
		await expect(page.getByRole('heading', {level: 1, name: `Greeting for ${name}`})).toBeVisible()

		await page.getByRole('button', {name: 'Save'}).click()
		await expect(page.getByRole('alert')).toHaveText('A greeting can’t be empty.')

		await page
			.getByRole('textbox', {name: /Greeting/})
			.fill(`Hello there, **${name}**!\n\nWhat a **play-maker** you are.`)
		await expect(page.getByText('play-maker', {exact: true})).toBeVisible()
		await page.getByRole('button', {name: 'Save'}).click()
		await expect(page.getByRole('status')).toHaveText('Saved ✓')

		await page.getByRole('link', {name: '← All greetings'}).click()
		await expect(page.getByRole('link', {name, exact: true})).toBeVisible()

		const poolSwitch = page.getByRole('switch', {name: `Show ${name} in random greetings`})
		await expect(poolSwitch).not.toBeChecked()
		await poolSwitch.press('Space')
		await expect(poolSwitch).toBeChecked()

		await page.goto('/')
		await expect(page.getByTestId('hydrated')).toBeVisible()
		await page.getByRole('link', {name: /another greeting/}).click()
		await expect(page).toHaveURL((url) => !['/', '/random'].includes(url.pathname))
		await expect(page).toHaveTitle(/^Hello there, .+ 👋$/)

		await page.goto(path)
		await expect(page.getByText('play-maker', {exact: true})).toBeVisible()

		await page.goto(`/admin${path}`)
		await expect(page.getByTestId('hydrated')).toBeVisible()
		await page.getByRole('button', {name: 'Delete'}).click()
		await expect(page).toHaveURL(/\/admin$/)
		await expect(page.getByRole('link', {name, exact: true})).toHaveCount(0)

		const randomRedirects = await Promise.all(
			Array.from({length: 20}, () => page.request.get('/random?not=World', {maxRedirects: 0})),
		)
		for (const redirect of randomRedirects) {
			expect(redirect.headers()['location']).not.toBe(path)
		}
	})
})
