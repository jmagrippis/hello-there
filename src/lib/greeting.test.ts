import {expect, it} from 'vite-plus/test'

import {toParagraphs} from './greeting'

it('splits paragraphs and marks the bolded puns', () => {
	expect(
		toParagraphs('Well hello there, **Johnny**!\n\nYou absolute **John-derful** human 😄'),
	).toEqual([
		[
			{text: 'Well hello there, ', isPun: false},
			{text: 'Johnny', isPun: true},
			{text: '!', isPun: false},
		],
		[
			{text: 'You absolute ', isPun: false},
			{text: 'John-derful', isPun: true},
			{text: ' human 😄', isPun: false},
		],
	])
})

it('ignores the blank lines models like to pad replies with', () => {
	expect(toParagraphs('\n\nHi **Zarina**!\n\n\n  \n')).toEqual([
		[
			{text: 'Hi ', isPun: false},
			{text: 'Zarina', isPun: true},
			{text: '!', isPun: false},
		],
	])
})

it('leaves an unclosed ** as plain text rather than bolding the rest', () => {
	expect(toParagraphs('Hi **Zarina, hello!')).toEqual([
		[{text: 'Hi **Zarina, hello!', isPun: false}],
	])
})
