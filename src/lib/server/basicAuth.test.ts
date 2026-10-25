import {expect, it} from 'vite-plus/test'

import {isAuthorized} from './basicAuth'

const expected = {username: 'johnny', password: 'hunter2:with:colons'}

const basic = (credentials: string) => `Basic ${new TextEncoder().encode(credentials).toBase64()}`

it('lets the admin in, even when the password itself contains colons', async () => {
	expect(await isAuthorized(basic('johnny:hunter2:with:colons'), expected)).toBe(true)
})

it('turns away a wrong username or password', async () => {
	expect(await isAuthorized(basic('johnny:hunter2'), expected)).toBe(false)
	expect(await isAuthorized(basic('zarina:hunter2:with:colons'), expected)).toBe(false)
})

it('turns away missing, malformed and non-Basic headers', async () => {
	expect(await isAuthorized(null, expected)).toBe(false)
	expect(await isAuthorized('Basic !!not-base64!!', expected)).toBe(false)
	expect(await isAuthorized(basic('no-separator'), expected)).toBe(false)
	expect(await isAuthorized('Bearer johnny:hunter2:with:colons', expected)).toBe(false)
})

it('never lets anyone in while the admin secrets are unset', async () => {
	expect(await isAuthorized(basic(':'), {username: '', password: ''})).toBe(false)
})
