import {findGreetings, GREETING_SORT_LABELS, isGreetingSort} from '#lib/server/greetingList'
import {listGreetings} from '#lib/server/greetings'
import {nameProblem} from '#lib/server/name'

import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({url}) => {
	const query = url.searchParams.get('q')?.trim() ?? ''
	const sortParam = url.searchParams.get('sort')
	const sort = isGreetingSort(sortParam) ? sortParam : 'newest'
	const greetings = findGreetings(await listGreetings(), query, sort)

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
