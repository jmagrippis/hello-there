import {error} from '@sveltejs/kit'
import {marked} from 'marked'

import {createChatCompletion} from '$lib/server/openai'
import {getGreeting, setGreeting} from '$lib/server/redis'
import {isBlocklisted} from '$lib/server/isBlocklisted'
import type {PageServerLoad} from './$types'

const FIVE_MINUTES_IN_SECONDS = 60 * 5

export const load = (async ({params, setHeaders}) => {
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

	let markdownGreeting: string | null
	markdownGreeting = await getGreeting(name)

	if (!markdownGreeting) {
		markdownGreeting = await createChatCompletion(name)
		await setGreeting(name, markdownGreeting)
	}

	setHeaders({
		'cache-control': `max-age=${FIVE_MINUTES_IN_SECONDS}`,
	})

	return {greeting: marked(markdownGreeting)}
}) satisfies PageServerLoad
