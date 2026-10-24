import type {Handle} from '@sveltejs/kit/hooks'
import {env} from 'cloudflare:workers'

import {isAuthorized} from '#lib/server/basicAuth'

const challenge = () =>
	new Response('Admins only 🔐', {
		status: 401,
		headers: {'WWW-Authenticate': 'Basic realm="Hello there admin", charset="UTF-8"'},
	})

export const handle: Handle = async ({event, resolve}) => {
	if (!event.route.id?.startsWith('/admin')) {
		return resolve(event)
	}

	const header = event.request.headers.get('Authorization')
	if (!header) {
		return challenge()
	}

	// counted before checking, so a correct guess is as rate limited as a wrong one
	const {success} = await env.ADMIN_LIMITER.limit({key: event.getClientAddress()})
	if (!success) {
		return new Response('Too many attempts, try again in a minute ⏳', {status: 429})
	}

	const expected = {username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD}

	return (await isAuthorized(header, expected)) ? resolve(event) : challenge()
}
