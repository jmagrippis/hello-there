import {error} from '@sveltejs/kit'

import {getGreeting, setGreeting} from '$lib/server/redis'
import {isBlocklisted} from '$lib/server/isBlocklisted'
import {createChatCompletion} from '$lib/server/openai'
import type {PageServerLoad} from './$types'
import {parseMarkdown} from '$lib/parseMarkdown'

const FIVE_MINUTES_IN_SECONDS = 60 * 5
const ONE_DAY_IN_SECONDS = 60 * 60 * 24

export const load = (async ({params, url, setHeaders}) => {
	const {name = 'World'} = params

	if (isBlocklisted(name)) {
		throw error(400, {
			message:
				'We don’t think that’s your name, we think you’re being naughty 😡',
		})
	}

	if (name.length > 16) {
		throw error(400, {
			message:
				'Listen, we wanna be inclusive, but that name is so long you may be trying to be naughty 🤔',
		})
	}

	const ogImageUrl = `${url.origin}/api/og?name=${name}`
	const metaTitle = `Hello there, ${name} 👋`
	const meta = {
		title: metaTitle,
		image: {
			url: ogImageUrl,
			alt: metaTitle,
		},
	}

	let greeting: null | string | Promise<string> = null

	greeting = await getGreeting(name).then((greeting) => {
		if (greeting) {
			setHeaders({
				'Cache-Control': `s-maxage=${FIVE_MINUTES_IN_SECONDS}, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
			})
			return parseMarkdown(greeting)
		}

		return null
	})

	if (!greeting) {
		greeting = createChatCompletion(name).then(async (aiGreeting) => {
			setGreeting(name, aiGreeting)

			return parseMarkdown(aiGreeting)
		})
	}

	return {
		meta,
		streamed: {greeting},
	}
}) satisfies PageServerLoad
