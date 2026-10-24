import {expect, it} from 'vite-plus/test'

import {findGreetings} from './greetingList'
import type {GreetingSummary} from './greetings'

const summary = (name: string, createdAt: number, editedAt: number | null): GreetingSummary => ({
	name,
	createdAt,
	editedAt,
	preview: `Hello ${name}`,
})

const greetings = [
	summary('Zarina', 1, null),
	summary('johnny', 3, null),
	summary('Johanna', 2, 5),
	summary('Alex', 4, 6),
]

const namesOf = (found: GreetingSummary[]) => found.map(({name}) => name)

it('finds names regardless of case', () => {
	expect(namesOf(findGreetings(greetings, 'JOH', 'name'))).toEqual(['Johanna', 'johnny'])
})

it('puts handcrafted greetings first when sorting by recently edited', () => {
	expect(namesOf(findGreetings(greetings, '', 'edited'))).toEqual([
		'Alex',
		'Johanna',
		'johnny',
		'Zarina',
	])
})

it('lists the newest greetings first', () => {
	expect(namesOf(findGreetings(greetings, '', 'newest'))).toEqual([
		'Alex',
		'johnny',
		'Johanna',
		'Zarina',
	])
})
