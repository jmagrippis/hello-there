import {fail} from '@sveltejs/kit'

import {findGreetings, GREETING_SORT_LABELS, isGreetingSort} from '#lib/server/greetingList'
import {getRandomPool, listGreetings, setInRandomPool} from '#lib/server/greetings'
import {nameProblem} from '#lib/server/name'

import type {Actions, PageServerLoad} from './$types'

export const load: PageServerLoad = async ({url}) => {
	const query = url.searchParams.get('q')?.trim() ?? ''
	const sortParam = url.searchParams.get('sort')
	const sort = isGreetingSort(sortParam) ? sortParam : 'newest'

	const [allGreetings, randomPool] = await Promise.all([listGreetings(), getRandomPool()])
	const greetings = findGreetings(allGreetings, query, sort).map((greeting) => ({
		...greeting,
		inRandomPool: randomPool.includes(greeting.name),
	}))

	return {
		meta: {
			title: 'Admin | Hello there 👋',
			description: 'Search, sort and edit the greetings stored for every name.',
		},
		query,
		sort,
		sortLabels: GREETING_SORT_LABELS,
		greetings,
		canWriteNew: query !== '' && !nameProblem(query) && !greetings.some(({name}) => name === query),
	}
}

export const actions = {
	pool: async ({request}) => {
		const data = await request.formData()
		const name = data.get('name')
		const include = data.get('include')

		if (typeof name !== 'string' || (include !== 'true' && include !== 'false')) {
			return fail(400)
		}

		await setInRandomPool(name, include === 'true')
	},
} satisfies Actions
