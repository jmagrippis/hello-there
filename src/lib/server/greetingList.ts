import type {GreetingSummary} from './greetings'

export const GREETING_SORT_LABELS = {
	newest: 'Newest',
	edited: 'Recently edited',
	name: 'Name',
} as const

export type GreetingSort = keyof typeof GREETING_SORT_LABELS

type Comparator = (a: GreetingSummary, b: GreetingSummary) => number

const COMPARATORS: Record<GreetingSort, Comparator> = {
	newest: (a, b) => b.createdAt - a.createdAt,
	edited: (a, b) => (b.editedAt ?? 0) - (a.editedAt ?? 0) || b.createdAt - a.createdAt,
	name: (a, b) => a.name.localeCompare(b.name),
}

export const isGreetingSort = (value: unknown): value is GreetingSort =>
	typeof value === 'string' && Object.hasOwn(GREETING_SORT_LABELS, value)

export const findGreetings = (greetings: GreetingSummary[], query: string, sort: GreetingSort) =>
	greetings
		.filter(({name}) => name.toLowerCase().includes(query.toLowerCase()))
		.toSorted(COMPARATORS[sort])
