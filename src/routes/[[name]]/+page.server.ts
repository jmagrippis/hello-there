import {createChatCompletion} from '$lib/server/openai'
import type {PageServerLoad} from './$types'

const FIVE_MINUTES_IN_SECONDS = 60 * 5

export const load = (async ({params, setHeaders}) => {
	const {name = 'World'} = params

	const greeting = await createChatCompletion(name)

	setHeaders({
		'cache-control': `max-age=${FIVE_MINUTES_IN_SECONDS}`,
	})
	return {greeting}
}) satisfies PageServerLoad
