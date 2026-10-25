import type {PageServerLoad} from './$types'

export const load: PageServerLoad = () => ({
	meta: {
		title: 'About | Hello there 👋',
		description:
			'Why Hello There exists: a little SvelteKit app on Cloudflare Workers where Claude greets you with a pun on your name, just like Johnny would.',
	},
})
