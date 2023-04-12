import type {PageServerLoad} from './$types'

export const load = (({params}) => {
	const {name = 'World'} = params

	const greeting = `Hello there ${name}, looking good!`

	return {greeting}
}) satisfies PageServerLoad
