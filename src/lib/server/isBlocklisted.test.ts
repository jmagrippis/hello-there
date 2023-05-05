import {it, expect} from 'vitest'
import crypto from 'crypto'

import {isBlocklisted} from './isBlocklisted'

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
