const FILE_EXTENSION_OR_PROFANITY_REGEX = /(\.\w+$|fuck)/gi

export const isBlocklisted = (name: string): boolean =>
	FILE_EXTENSION_OR_PROFANITY_REGEX.test(name)
