import {createChatCompletion} from '$lib/server/openai'
import {getGreeting, setGreeting} from '$lib/server/redis'
import type {PageServerLoad} from './$types'

const FIVE_MINUTES_IN_SECONDS = 60 * 5

export const load = (async ({params, setHeaders}) => {
	const {name = 'World'} = params

	let greeting: string | null
	greeting = await getGreeting(name)

	if (!greeting) {
		greeting = await createChatCompletion(name)
		await setGreeting(name, greeting)
	}

	setHeaders({
		'cache-control': `max-age=${FIVE_MINUTES_IN_SECONDS}`,
	})
	return {greeting}
}) satisfies PageServerLoad
