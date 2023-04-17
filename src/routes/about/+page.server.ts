import type {PageServerLoad} from './$types'

const ONE_HOUR_IN_SECONDS = 60 * 60
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24

export const load: PageServerLoad = async ({setHeaders}) => {
	setHeaders({
		'Cache-Control': `s-maxage=${ONE_HOUR_IN_SECONDS}, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
	})

	return {
		meta: {
			title: 'About | Hello there 👋',
		},
	}
}
