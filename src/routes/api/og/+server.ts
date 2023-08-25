import satori from 'satori'

import type {RequestHandler} from './$types'

const brandHue = '142deg'
const emphasisHue = '142deg'

const surfaceColor = `hsl(${brandHue} 10% 10%)`
const copyColor = `hsl(${brandHue} 100% 97%)`
const emphasisColor = `hsl(${emphasisHue} 78% 60%)`

const ONE_HOUR_IN_SECONDS = 60 * 60
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24

export const GET = (async ({fetch, url, setHeaders}) => {
	const name = url.searchParams.get('name') ?? 'World'

	const grandstanderData = await fetch('/fonts/Grandstander-Regular.ttf').then(
		(res) => res.arrayBuffer(),
	)
	const notoEmojiData = await fetch('/fonts/NotoEmoji-Regular.ttf').then(
		(res) => res.arrayBuffer(),
	)

	const svg = await satori(
		{
			type: 'div',
			props: {
				children: [
					{
						type: 'div',
						props: {
							children: '👋',
							style: {fontSize: '128px'},
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								gap: '16px',
								flexDirection: 'column',
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											gap: '16px',
										},
										children: [
											{
												type: 'div',
												props: {
													children: 'Hello there,',
												},
											},
											{
												type: 'div',
												props: {
													children: name,
													style: {
														color: emphasisColor,
													},
												},
											},
											{
												type: 'div',
												props: {
													children: '!',
												},
											},
										],
									},
								},
								{
									type: 'div',
									props: {
										children: 'open for a personalised greeting by Johnny 🙂',
										style: {fontSize: '32px'},
									},
								},
							],
						},
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
					gap: '64px',
					padding: '16px',
					alignItems: 'center',
				},
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{name: 'Grandstander', data: grandstanderData},
				{name: 'Noto Emoji', data: notoEmojiData},
			],
		},
	)

	setHeaders({
		'Cache-Control': `s-maxage=${ONE_HOUR_IN_SECONDS}, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
	})

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
		},
	})
}) satisfies RequestHandler
