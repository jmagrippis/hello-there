import {env, waitUntil} from 'cloudflare:workers'

export const getStoredGreeting = (name: string) => env.GREETINGS.get(name)

export const storeGreeting = (name: string, greeting: string) =>
	waitUntil(env.GREETINGS.put(name, greeting))
