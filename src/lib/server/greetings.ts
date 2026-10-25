import {env, waitUntil} from 'cloudflare:workers'

const KEY_PREFIX = 'greeting:'
const PREVIEW_LENGTH = 100
// one key, so a random pick is a single read rather than a list
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

// kept in metadata, which `list()` returns without reading values
const previewOf = (greeting: string) => Array.from(greeting).slice(0, PREVIEW_LENGTH).join('')

export const getGreeting = (name: string) => env.KV.get(keyFor(name))

export const storeGeneratedGreeting = (name: string, greeting: string) =>
	waitUntil(
		env.KV.put(keyFor(name), greeting, {
			metadata: {createdAt: Date.now(), editedAt: null, preview: previewOf(greeting)},
		}),
	)

export const saveEditedGreeting = async (name: string, greeting: string) => {
	const {metadata} = await env.KV.getWithMetadata<GreetingMetadata>(keyFor(name))
	const editedAt = Date.now()

	await env.KV.put(keyFor(name), greeting, {
		metadata: {
			createdAt: metadata?.createdAt ?? editedAt,
			editedAt,
			preview: previewOf(greeting),
		},
	})
}

export const getRandomPool = async () => (await env.KV.get<string[]>(RANDOM_POOL_KEY, 'json')) ?? []

// only stored greetings may join, so a random pick never triggers a fresh, unvetted one
export const setInRandomPool = async (name: string, included: boolean) => {
	const pool = new Set(await getRandomPool())

	if (included && (await getGreeting(name)) !== null) {
		pool.add(name)
	} else {
		pool.delete(name)
	}

	await env.KV.put(RANDOM_POOL_KEY, JSON.stringify([...pool].toSorted()))
}

export const deleteGreeting = async (name: string) => {
	await setInRandomPool(name, false)
	await env.KV.delete(keyFor(name))
}

export const listGreetings = async () => {
	const greetings: GreetingSummary[] = []
	let cursor: string | null = null

	do {
		const page: KVNamespaceListResult<GreetingMetadata> = await env.KV.list({
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
