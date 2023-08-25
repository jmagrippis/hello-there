import {test, expect} from '@playwright/test'

test('navigation smoke test', async ({page}) => {
	// start at the home page
	await page.goto('/')

	await expect(
		page.getByRole('heading', {level: 1, name: /Hello there/i}),
	).toHaveText('👋')
	await expect(page).toHaveTitle(/Hello there/i)

	// navigate to the About Page
	await page.getByRole('link', {name: /About/i}).click()

	await expect(
		page.getByRole('heading', {level: 1, name: /About/i}),
	).toBeInViewport()
	await expect(page).toHaveTitle(/About/)

	// navigate to a specific name
	await page.goto('/ChatGPT')
	await expect(page).toHaveTitle(/Hello there, ChatGPT/i)
})
