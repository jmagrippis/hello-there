import {expect, test} from '@playwright/test'

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

test('every page carries its own title, and each name gets its own share card', async ({page}) => {
	await page.goto('/')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	await expect(page.getByRole('heading', {level: 1, name: 'Hello there'})).toHaveText('👋')
	await expect(page).toHaveTitle('Hello there, World 👋')

	await page.getByRole('link', {name: 'About'}).click()
	await expect(page.getByRole('heading', {level: 1, name: 'About'})).toBeInViewport()
	await expect(page).toHaveTitle('About | Hello there 👋')

	await page.getByRole('link', {name: 'Hello there'}).click()
	await expect(page).toHaveTitle('Hello there, World 👋')

	await page.goto(`/${encodeURIComponent('Zoë Mae')}`)
	await expect(page.getByTestId('hydrated')).toBeVisible()
	await expect(page).toHaveTitle('Hello there, Zoë Mae 👋')

	const ogImageUrl = await page.locator('meta[property="og:image"]').getAttribute('content')
	expect(ogImageUrl).toMatch(/\/og\/Zo%C3%AB%20Mae\.png$/)

	const ogImage = await page.request.get(ogImageUrl ?? '')
	expect(ogImage.ok()).toBe(true)
	expect(ogImage.headers()['content-type']).toBe('image/png')
	expect([...(await ogImage.body()).subarray(0, PNG_SIGNATURE.length)]).toEqual(PNG_SIGNATURE)
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
