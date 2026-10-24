import {expect, test} from '@playwright/test'

test('a visitor gets greeted, reads about the app, then greets a friend', async ({page}) => {
	await page.goto('/')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	await expect(page.getByRole('heading', {level: 1, name: 'Hello there'})).toHaveText('👋')
	await expect(page).toHaveTitle('Hello there, World 👋')

	await page.getByRole('link', {name: 'About'}).click()
	await expect(page.getByRole('heading', {level: 1, name: 'About'})).toBeInViewport()
	await expect(page).toHaveTitle('About | Hello there 👋')

	await page.getByRole('link', {name: 'Hello there'}).click()
	await expect(page).toHaveTitle('Hello there, World 👋')

	await page.goto('/Claude')
	await expect(page.getByTestId('hydrated')).toBeVisible()
	await expect(page).toHaveTitle('Hello there, Claude 👋')

	const ogImageUrl = await page.locator('meta[property="og:image"]').getAttribute('content')
	expect(ogImageUrl).toMatch(/\/og\/Claude\.png$/)

	const ogImage = await page.request.get(ogImageUrl ?? '')
	expect(ogImage.ok()).toBe(true)
	expect(ogImage.headers()['content-type']).toBe('image/png')
})

test('naughty names get turned away before anyone asks Claude', async ({page}) => {
	for (const name of ['wp-login.php', 'wp-login.php', 'ThisNameIsWayTooLong']) {
		const response = await page.goto(`/${name}`)
		expect(response?.status()).toBe(400)
		await expect(page.getByRole('heading', {level: 1, name: 'We’ve had an error 😱'})).toBeVisible()

		const ogImage = await page.request.get(`/og/${name}.png`)
		expect(ogImage.status()).toBe(400)
	}
})
