const blocklist: Record<string, string> = {
	'.env': 'someone is trying to steal our secrets 😡',
	'wp-login.php': 'someone trying to hack our wordpress site 😡',
}

export const isBlocklisted = (name: string): boolean => !!blocklist[name]
