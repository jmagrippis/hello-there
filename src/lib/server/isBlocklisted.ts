const FILE_EXTENSION_OR_PROFANITY_REGEX = /(\.\w+$|fuck)/i

export const isBlocklisted = (name: string): boolean => FILE_EXTENSION_OR_PROFANITY_REGEX.test(name)
