export type Credentials = {
	username: string
	password: string
}

const digest = async (value: string) =>
	new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))

// digests are always 32 bytes and XOR-folded in full, so timing leaks neither length nor content
const isSameSecret = async (given: string, expected: string) => {
	const [givenDigest, expectedDigest] = await Promise.all([digest(given), digest(expected)])

	return (
		givenDigest.reduce(
			(difference, byte, index) => difference | (byte ^ expectedDigest[index]),
			0,
		) === 0
	)
}

export const parseBasicAuth = (header: string | null): Credentials | null => {
	const encoded = header?.match(/^Basic\s+(\S+)$/i)?.[1]
	if (!encoded) {
		return null
	}

	try {
		const decoded = new TextDecoder().decode(Uint8Array.fromBase64(encoded))
		const separator = decoded.indexOf(':')

		return separator === -1
			? null
			: {username: decoded.slice(0, separator), password: decoded.slice(separator + 1)}
	} catch {
		return null
	}
}

export const isAuthorized = async (header: string | null, expected: Credentials) => {
	const credentials = parseBasicAuth(header)

	if (!credentials || !expected.username || !expected.password) {
		return false
	}

	const [usernameMatches, passwordMatches] = await Promise.all([
		isSameSecret(credentials.username, expected.username),
		isSameSecret(credentials.password, expected.password),
	])

	return usernameMatches && passwordMatches
}
