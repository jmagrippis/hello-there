import {createChatCompletion} from '$lib/server/openai'
import type {PageServerLoad} from './$types'

export const load = (async ({params}) => {
	const {name = 'World'} = params

	const greeting = await createChatCompletion(name)

	return {greeting}
}) satisfies PageServerLoad
