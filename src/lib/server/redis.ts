import {Redis} from '@upstash/redis'
import {REDIS_URL, REDIS_TOKEN} from '$env/static/private'

const redis = new Redis({
	url: REDIS_URL,
	token: REDIS_TOKEN,
})

export const getGreeting = (name: string) => redis.get<string>(name)

export const setGreeting = (name: string, value: string) =>
	redis.set(name, value)
