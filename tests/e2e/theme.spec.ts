import {expect, test} from '@playwright/test'

test.use({colorScheme: 'light'})

test('a visitor who prefers light mode switches to dark, and it sticks', async ({page}) => {
	await page.goto('/about')
	await expect(page.getByTestId('hydrated')).toBeVisible()

	const html = page.locator('html')
	await expect(html).toHaveAttribute('data-theme', 'auto')

	await page.getByRole('button', {name: 'Switch to the dark theme'}).click()
	await expect(html).toHaveAttribute('data-theme', 'dark')
	await expect(page.getByRole('button', {name: 'Switch to the light theme'})).toBeVisible()
	await expect(page).toHaveURL(/\/about$/)

	await page.reload()
	await expect(page.getByTestId('hydrated')).toBeVisible()
	await expect(html).toHaveAttribute('data-theme', 'dark')

	await page.getByRole('button', {name: 'Switch to the light theme'}).click()
	await expect(html).toHaveAttribute('data-theme', 'light')
})

test.describe('without JavaScript', () => {
	test.use({javaScriptEnabled: false})

	test('the theme toggle still works as a plain form', async ({page}) => {
		await page.goto('/about')

		const html = page.locator('html')
		await expect(html).toHaveAttribute('data-theme', 'auto')

		await page.getByRole('button', {name: 'Switch to the dark theme'}).click()
		await expect(html).toHaveAttribute('data-theme', 'dark')
		await expect(page.getByRole('heading', {level: 1, name: 'About'})).toBeVisible()
	})
})
