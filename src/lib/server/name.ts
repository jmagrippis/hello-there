import {error} from '@sveltejs/kit'

const MAX_NAME_LENGTH = 16

const FILE_EXTENSION_OR_PROFANITY_REGEX = /(\.\w+$|fuck)/i

export const isBlocklisted = (name: string): boolean => FILE_EXTENSION_OR_PROFANITY_REGEX.test(name)

export const assertGreetable = (name: string) => {
	if (isBlocklisted(name)) {
		error(400, 'We don’t think that’s your name, we think you’re being naughty 😡')
	}

	if (name.length > MAX_NAME_LENGTH) {
		error(
			400,
			'Listen, we wanna be inclusive, but that name is so long you may be trying to be naughty 🤔',
		)
	}
}
