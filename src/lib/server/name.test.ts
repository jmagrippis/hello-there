import {isHttpError} from '@sveltejs/kit'
import {expect, it} from 'vite-plus/test'

import {assertGreetable, isBlocklisted} from './name'

it('blocks the file paths bots probe for', () => {
	expect(isBlocklisted('.env')).toBe(true)
	expect(isBlocklisted('wp-login.php')).toBe(true)
	expect(isBlocklisted('backup.tar')).toBe(true)
})

it('lets real names through, including ones with numbers and abbreviations', () => {
	expect(isBlocklisted('Zarina')).toBe(false)
	expect(isBlocklisted('Alexandra the 3rd')).toBe(false)
	expect(isBlocklisted('Summer Jr.')).toBe(false)
	expect(isBlocklisted('Timmy Sr. Tester')).toBe(false)
})

it('keeps blocking profanity on every request a long-lived isolate serves', () => {
	// I don't like committing this but it's needed 🙄
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
