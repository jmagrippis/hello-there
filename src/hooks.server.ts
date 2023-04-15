import type {Handle} from '@sveltejs/kit'

import {isValidTheme} from '$lib/stores/theme'

const FIVE_MINUTES_IN_SECONDS = 60 * 5

export const handle: Handle = async ({event, resolve}) => {
	const theme = event.cookies.get('theme') ?? 'auto'
	if (isValidTheme(theme)) {
		event.locals.theme = theme
	}

	event.setHeaders({
		'Cache-Control': `max-age=${FIVE_MINUTES_IN_SECONDS}`,
	})

	return resolve(event, {
		transformPageChunk: ({html}) => html.replace('%THEME%', theme),
		/**
		 * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
		 *
		 * https://github.com/sveltejs/kit/issues/8061
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range'
		},
	})
}
