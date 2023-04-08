import satori from 'satori'

import type {RequestHandler} from './$types'

const brandHue = '142deg'

const surfaceColor = `hsl(${brandHue} 10% 10%)`
const copyColor = `hsl(${brandHue} 100% 97%)`

export const GET = (async ({fetch, url}) => {
	const name = url.searchParams.get('name') ?? 'World'

	const grandstanderData = await fetch(
		'/fonts/Grandstander-VariableFont_wght.ttf'
	).then((res) => res.arrayBuffer())
	const notoEmojiData = await fetch('/fonts/NotoEmoji-Regular.ttf').then(
		(res) => res.arrayBuffer()
	)

	const greeting = `Hello there, ${name}!`

	const svg = await satori(
		{
			type: 'div',
			props: {
				children: [
					{
						type: 'div',
						props: {
							children: greeting,
						},
						style: {'flex-shrink': 0},
					},
				],
				style: {
					backgroundColor: surfaceColor,
					color: copyColor,
					width: '100%',
					height: '100%',
					display: 'flex',
					fontFamily: 'Grandstander, sans-serif, "Noto Emoji"',
					fontSize: '64px',
					gap: '32px',
					padding: '16px',
					'align-items': 'center',
				},
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{name: 'Alef', data: grandstanderData},
				{name: 'Noto Emoji', data: notoEmojiData},
			],
		}
	)
	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
		},
	})
}) satisfies RequestHandler
