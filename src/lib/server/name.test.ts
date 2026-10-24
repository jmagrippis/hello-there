import crypto from 'node:crypto'

import {isHttpError} from '@sveltejs/kit'
import {expect, it} from 'vite-plus/test'

import {assertGreetable, isBlocklisted} from './name'

it('blocks names that look like files', () => {
	expect(isBlocklisted('.env')).toBe(true)
	expect(isBlocklisted('wp-login.php')).toBe(true)

	const randomFilename = `${crypto.randomUUID()}.ts`

	expect(isBlocklisted(randomFilename)).toBe(true)
})

it('allows common names', () => {
	expect(isBlocklisted('Zarina')).toBe(false)
	expect(isBlocklisted('Johnny')).toBe(false)
})

it('allows names with numbers', () => {
	expect(isBlocklisted('Alexandra the 3rd')).toBe(false)
	expect(isBlocklisted('hunter42')).toBe(false)
})

it('allows names with dots', () => {
	expect(isBlocklisted('Summer Jr.')).toBe(false)
	expect(isBlocklisted('Timmy Sr. Tester')).toBe(false)
})

it('blocks names that are likely profanity', () => {
	// I don't like committing this but it's needed 🙄
	expect(isBlocklisted('Meet the Fuckers')).toBe(true)
})

it('keeps blocking the same name on every request a long-lived isolate serves', () => {
	expect(isBlocklisted('Meet the Fuckers')).toBe(true)
	expect(isBlocklisted('Meet the Fuckers')).toBe(true)
	expect(isBlocklisted('.env')).toBe(true)
	expect(isBlocklisted('.env')).toBe(true)
})

it('greets names up to 16 characters and turns longer ones away with a 400', () => {
	expect(() => assertGreetable('Alexandra the 3r')).not.toThrow()

	try {
		assertGreetable('Alexandra the 3rd')
		expect.unreachable()
	} catch (error) {
		expect(isHttpError(error, 400)).toBe(true)
	}
})
