import {form, getRequestEvent} from '$app/server'
import {z} from 'zod'

import {THEME_COOKIE, THEMES} from '#lib/theme'

const TEN_YEARS_IN_SECONDS = 10 * 365 * 24 * 60 * 60

export const setTheme = form(z.object({theme: z.enum(THEMES)}), ({theme}) => {
	const {cookies, locals} = getRequestEvent()

	cookies.set(THEME_COOKIE, theme, {path: '/', maxAge: TEN_YEARS_IN_SECONDS})
	// without JavaScript, this same request renders the page, after `handle` already read the cookie
	locals.theme = theme
})
