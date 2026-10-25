import {error} from '@sveltejs/kit'

const MAX_NAME_LENGTH = 16

const FILE_EXTENSION_OR_PROFANITY_REGEX = /(\.\w+$|fuck)/i

export const isBlocklisted = (name: string): boolean => FILE_EXTENSION_OR_PROFANITY_REGEX.test(name)

export const nameProblem = (name: string) => {
	if (isBlocklisted(name)) {
		return 'We don’t think that’s your name, we think you’re being naughty 😡'
	}

	if (name.length > MAX_NAME_LENGTH) {
		return 'Listen, we wanna be inclusive, but that name is so long you may be trying to be naughty 🤔'
	}

	return null
}

export const assertGreetable = (name: string) => {
	const problem = nameProblem(name)

	if (problem) {
		error(400, problem)
	}
}
