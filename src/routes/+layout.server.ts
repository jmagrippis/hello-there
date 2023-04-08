import type {LayoutServerLoad} from './$types'

export const load: LayoutServerLoad = async ({locals, url}) => {
	const {theme} = locals

	const ogImageUrl = `${url.origin}/api/og`

	return {
		theme,
		defaultMeta: {
			title: 'Hello there 👋',
			description:
				'Welcome to the official app which uses both generative and artificial AI to greet you just like I would 👋 Have a lovely day!',
			image: {
				url: ogImageUrl,
				alt: 'Hello there, World! 👋',
			},
		},
	}
}
