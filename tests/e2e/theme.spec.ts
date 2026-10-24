import {expect, test} from '@playwright/test'

test('a visitor starts in dark mode, switches to light, and it sticks', async ({page}) => {
	await page.goto('/about')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	const html = page.locator('html')
	await expect(html).toHaveAttribute('data-theme', 'dark')

	await page.getByRole('button', {name: 'toggle light/dark theme'}).click()
	await expect(html).toHaveAttribute('data-theme', 'light')

	await page.reload()
	await expect(page.getByTestId('hydrated')).toBeVisible()
	await expect(html).toHaveAttribute('data-theme', 'light')
})
