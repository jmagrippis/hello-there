import {expect, test} from '@playwright/test'

test('the admin area asks for a password', async ({request}) => {
	const response = await request.get('/admin')

	expect(response.status()).toBe(401)
	expect(response.headers()['www-authenticate']).toMatch(/^Basic /)
})

test.describe('as the admin', () => {
	test.use({
		httpCredentials: {
			username: process.env.ADMIN_USERNAME ?? '',
			password: process.env.ADMIN_PASSWORD ?? '',
		},
	})

	test('handcrafts a greeting, sees it on the page, then hands the name back to Claude', async ({
		page,
	}) => {
		const name = `Pw${Date.now().toString(36).slice(-6)}`

		await page.goto('/admin')
		await expect(page.getByTestId('hydrated')).toBeVisible()

		await page.getByRole('searchbox', {name: 'Name'}).fill(name)
		await page.getByRole('button', {name: 'Search'}).click()
		await page.getByRole('link', {name: `Write a greeting for “${name}”`}).click()

		await expect(page.getByRole('heading', {level: 1, name: `Greeting for ${name}`})).toBeVisible()
		await page
			.getByRole('textbox', {name: /Greeting/})
			.fill(`Hello there, **${name}**!\n\nWhat a **play-maker** you are.`)
		await expect(page.getByText('play-maker', {exact: true})).toBeVisible()
		await page.getByRole('button', {name: 'Save'}).click()
		await expect(page.getByRole('status')).toHaveText('Saved ✓')

		await page.getByRole('link', {name: '← All greetings'}).click()
		await page.getByRole('combobox', {name: 'Sort by'}).selectOption('Recently edited')
		await page.getByRole('button', {name: 'Search'}).click()
		await expect(page.getByRole('row').nth(1)).toContainText(name)

		await page.goto(`/${name}`)
		await expect(page.getByText('play-maker', {exact: true})).toBeVisible()

		await page.goto(`/admin/${name}`)
		await page.getByRole('button', {name: 'Delete'}).click()
		await expect(page).toHaveURL(/\/admin$/)
		await expect(page.getByRole('link', {name, exact: true})).toHaveCount(0)
	})
})
