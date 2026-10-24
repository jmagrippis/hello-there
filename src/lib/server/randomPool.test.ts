import {expect, it, vi} from 'vite-plus/test'

import {pickAnother} from './randomPool'

it('never sends a visitor back to the greeting they are already on', () => {
	vi.spyOn(Math, 'random').mockReturnValue(0)

	expect(pickAnother(['Johnny', 'Zarina'], 'Johnny')).toBe('Zarina')
})

it('can land on every other greeting in the pool', () => {
	const random = vi.spyOn(Math, 'random')

	random.mockReturnValue(0)
	expect(pickAnother(['Alex', 'Johnny', 'Zarina'], 'Johnny')).toBe('Alex')

	random.mockReturnValue(0.999)
	expect(pickAnother(['Alex', 'Johnny', 'Zarina'], 'Johnny')).toBe('Zarina')
})

it('has nowhere to go when the pool holds only the current greeting, or nothing', () => {
	expect(pickAnother(['Johnny'], 'Johnny')).toBeNull()
	expect(pickAnother([], null)).toBeNull()
})
