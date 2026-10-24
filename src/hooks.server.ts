import type {Handle} from '@sveltejs/kit/hooks'

import {isTheme, THEME_COOKIE} from '#lib/theme'

export const handle: Handle = async ({event, resolve}) => {
	const theme = event.cookies.get(THEME_COOKIE)
	event.locals.theme = isTheme(theme) ? theme : 'auto'

	return resolve(event, {
		transformPageChunk: ({html}) => html.replace('%THEME%', event.locals.theme),
	})
}
