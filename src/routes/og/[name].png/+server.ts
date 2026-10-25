import {env, waitUntil} from 'cloudflare:workers'

import {assertGreetable} from '#lib/server/name'
import {renderOgImage} from '#lib/server/ogImage'

import type {RequestHandler} from './$types'

const headers = {'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400'}

export const GET: RequestHandler = async ({params}) => {
	const {name} = params
	assertGreetable(name)

	const key = `og:${name}`
	const storedImage = await env.GREETINGS.get(key, 'arrayBuffer')
	if (storedImage) {
		return new Response(storedImage, {headers})
	}

	const image = await renderOgImage(name)
	waitUntil(env.GREETINGS.put(key, image))

	return new Response(image, {headers})
}
