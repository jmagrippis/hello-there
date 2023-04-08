import {fail, type Actions} from '@sveltejs/kit'

import {isValidTheme} from '$lib/stores/theme'

const TEN_YEARS_IN_SECONDS = 10 * 365 * 24 * 60 * 60

export const actions = {
	default: async ({cookies, request}) => {
		const data = await request.formData()
		const theme = data.get('theme')

		if (!isValidTheme(theme)) {
			return fail(400, {error: `invalid theme: ${theme}}`})
		}

		cookies.set('theme', theme, {path: '/', maxAge: TEN_YEARS_IN_SECONDS})

		return {theme}
	},
} satisfies Actions
