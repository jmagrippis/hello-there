import {error} from '@sveltejs/kit'

import {createGreeting} from '#lib/server/claude'
import {getStoredGreeting, storeGreeting} from '#lib/server/greetings'
import {isBlocklisted} from '#lib/server/isBlocklisted'
import {parseMarkdown} from '#lib/server/markdown'

import type {PageServerLoad} from './$types'

const MAX_NAME_LENGTH = 16

// a rejection streamed to the browser lands before hydration can handle it, so failures resolve to null
const generateGreeting = async (name: string) => {
	try {
		const greeting = await createGreeting(name)
		storeGreeting(name, greeting)

		return parseMarkdown(greeting)
	} catch (error) {
		console.error(`Could not greet ${name}`, error)
		return null
	}
}

export const load: PageServerLoad = async ({params}) => {
	const {name = 'World'} = params

	if (isBlocklisted(name)) {
		error(400, 'We don’t think that’s your name, we think you’re being naughty 😡')
	}

	if (name.length > MAX_NAME_LENGTH) {
		error(
			400,
			'Listen, we wanna be inclusive, but that name is so long you may be trying to be naughty 🤔',
		)
	}

	const storedGreeting = await getStoredGreeting(name)

	return {
		meta: {
			title: `Hello there, ${name} 👋`,
			description: `A personalised, pun-filled greeting for ${name}, written just the way Johnny would say it 👋`,
		},
		greeting: storedGreeting ? parseMarkdown(storedGreeting) : generateGreeting(name),
	}
}
