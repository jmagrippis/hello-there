import {env, waitUntil} from 'cloudflare:workers'

const KEY_PREFIX = 'greeting:'
const PREVIEW_LENGTH = 100
// one key holding every approved name, so a random pick costs a single cached read
const RANDOM_POOL_KEY = 'random-pool'

export type GreetingMetadata = {
	createdAt: number
	editedAt: number | null
	preview: string
}

export type GreetingSummary = GreetingMetadata & {
	name: string
}

const keyFor = (name: string) => `${KEY_PREFIX}${name}`

// KV lists hand back metadata without reading values, so the admin table needs no extra reads
const previewOf = (greeting: string) => Array.from(greeting).slice(0, PREVIEW_LENGTH).join('')

export const getGreeting = (name: string) => env.GREETINGS.get(keyFor(name))

export const storeGeneratedGreeting = (name: string, greeting: string) =>
	waitUntil(
		env.GREETINGS.put(keyFor(name), greeting, {
			metadata: {createdAt: Date.now(), editedAt: null, preview: previewOf(greeting)},
		}),
	)

export const saveEditedGreeting = async (name: string, greeting: string) => {
	const {metadata} = await env.GREETINGS.getWithMetadata<GreetingMetadata>(keyFor(name))
	const editedAt = Date.now()

	await env.GREETINGS.put(keyFor(name), greeting, {
		metadata: {
			createdAt: metadata?.createdAt ?? editedAt,
			editedAt,
			preview: previewOf(greeting),
		},
	})
}

export const getRandomPool = async () =>
	(await env.GREETINGS.get<string[]>(RANDOM_POOL_KEY, 'json')) ?? []

// only names with a stored greeting may join, or a random pick could make Claude write an unvetted one
export const setInRandomPool = async (name: string, included: boolean) => {
	const pool = new Set(await getRandomPool())

	if (included && (await getGreeting(name)) !== null) {
		pool.add(name)
	} else {
		pool.delete(name)
	}

	await env.GREETINGS.put(RANDOM_POOL_KEY, JSON.stringify([...pool].toSorted()))
}

export const deleteGreeting = async (name: string) => {
	await setInRandomPool(name, false)
	await env.GREETINGS.delete(keyFor(name))
}

export const listGreetings = async () => {
	const greetings: GreetingSummary[] = []
	let cursor: string | null = null

	do {
		const page: KVNamespaceListResult<GreetingMetadata> = await env.GREETINGS.list({
			prefix: KEY_PREFIX,
			cursor,
		})

		for (const {name, metadata} of page.keys) {
			if (metadata) {
				greetings.push({...metadata, name: name.slice(KEY_PREFIX.length)})
			}
		}

		cursor = page.list_complete ? null : page.cursor
	} while (cursor)

	return greetings
}
