// @vitest-environment jsdom
import {render, screen} from '@testing-library/svelte'
import {expect, it} from 'vite-plus/test'

import {ogImagePath} from '#lib/meta'

import Page from './+page.svelte'

const NAME = 'Zarina'
const PUN = 'Zarina-ding'

it('offers a different greeting only once this one has landed', async () => {
	const greeting = Promise.withResolvers<string | null>()
	render(Page, {
		props: {
			params: {name: NAME},
			form: null,
			data: {
				meta: {
					title: `Hello there, ${NAME} 👋`,
					description: `A greeting for ${NAME}`,
					image: ogImagePath(NAME),
				},
				name: NAME,
				hasAnotherGreeting: true,
				greeting: greeting.promise,
			},
		},
	})

	expect(screen.queryByRole('progressbar')).not.toBeNull()
	expect(screen.queryByRole('link', {name: /another greeting/})).toBeNull()

	greeting.resolve(`Hey **${PUN}**!`)

	const anotherGreeting = await screen.findByRole('link', {name: /another greeting/})
	const destination = new URL(anotherGreeting.getAttribute('href') ?? '', 'http://localhost')
	expect(destination.searchParams.get('not')).toBe(NAME)
	expect(screen.queryByText(PUN)).not.toBeNull()
	expect(screen.queryByRole('progressbar')).toBeNull()
})
