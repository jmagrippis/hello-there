import {assertGreetable} from '#lib/server/name'
import {renderOgImage} from '#lib/server/ogImage'

import type {RequestHandler} from './$types'

export const GET: RequestHandler = async ({params}) => {
	const {name} = params
	assertGreetable(name)

	return new Response(await renderOgImage(name), {
		headers: {'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400'},
	})
}
