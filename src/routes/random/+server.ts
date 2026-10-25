import {redirect} from '@sveltejs/kit'

import {getRandomPool} from '#lib/server/greetings'
import {pickAnother} from '#lib/server/randomPool'

import type {RequestHandler} from './$types'

export const GET: RequestHandler = async ({url}) => {
	const name = pickAnother(await getRandomPool(), url.searchParams.get('not'))

	redirect(303, name ? `/${encodeURIComponent(name)}` : '/')
}
