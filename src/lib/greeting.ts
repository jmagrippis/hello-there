export type GreetingSegment = {
	text: string
	isPun: boolean
}

export type GreetingParagraph = GreetingSegment[]

const PUN_REGEX = /\*\*(.+?)\*\*/

export const toParagraphs = (greeting: string): GreetingParagraph[] =>
	greeting
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)
		.map((paragraph) =>
			paragraph
				.split(PUN_REGEX)
				.map((text, index) => ({text, isPun: index % 2 === 1}))
				.filter(({text}) => text),
		)
