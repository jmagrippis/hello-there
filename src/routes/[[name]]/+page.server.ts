import {error} from '@sveltejs/kit'
import {marked} from 'marked'

import {getGreeting} from '$lib/server/redis'
import {isBlocklisted} from '$lib/server/isBlocklisted'
import type {PageServerLoad} from './$types'

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

	const dbGreeting = await getGreeting(name).then((greeting) => {
		if (greeting) {
			setHeaders({
				'Cache-Control': `s-maxage=${FIVE_MINUTES_IN_SECONDS}, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
			})
			return marked(greeting)
		}

		return null
	})

	return {
		meta,
		name,
		dbGreeting,
	}
}) satisfies PageServerLoad
