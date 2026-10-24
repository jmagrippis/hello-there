import {env} from 'cloudflare:workers'

import {DEFAULT_NAME, ogImagePath} from '#lib/meta'
import {createGreeting} from '#lib/server/claude'
import {getGreeting, storeGeneratedGreeting} from '#lib/server/greetings'
import {assertGreetable} from '#lib/server/name'

import type {PageServerLoad} from './$types'

// a rejection streamed to the browser lands before hydration can handle it, so failures resolve to null
const generateGreeting = async (name: string, clientAddress: string) => {
	try {
		const {success} = await env.GREETING_LIMITER.limit({key: clientAddress})
		if (!success) {
			return null
		}

		const greeting = await createGreeting(name)
		storeGeneratedGreeting(name, greeting)

		return greeting
	} catch (error) {
		console.error(`Could not greet ${name}`, error)
		return null
	}
}

export const load: PageServerLoad = async ({params, getClientAddress}) => {
	const {name = DEFAULT_NAME} = params
	assertGreetable(name)

	const storedGreeting = await getGreeting(name)

	return {
		meta: {
			title: `Hello there, ${name} 👋`,
			description: `A personalised, pun-filled greeting for ${name}, written just the way Johnny would say it 👋`,
			image: ogImagePath(name),
		},
		greeting: storedGreeting ?? generateGreeting(name, getClientAddress()),
	}
}
