import {Redis} from 'ioredis'
import {REDIS_PASSWORD, REDIS_PORT, REDIS_URL} from '$env/static/private'

const redis = new Redis({
	host: REDIS_URL,
	password: REDIS_PASSWORD,
	port: parseInt(REDIS_PORT),
})

export const getGreeting = (name: string) => redis.get(name)

export const setGreeting = (name: string, value: string) =>
	redis.set(name, value)
