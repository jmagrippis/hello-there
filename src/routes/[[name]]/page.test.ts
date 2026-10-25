import {render} from 'svelte/server'
import {expect, it} from 'vite-plus/test'

import {ogImagePath} from '#lib/meta'

import type {PageData} from './$types'
import Page from './+page.svelte'

const NAME = 'Zarina'

const renderGreeting = (greeting: PageData['greeting']) =>
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
				greeting,
			},
		},
	}).body

it('only offers another greeting once Johnny has finished thinking of this one', () => {
	const thinking = renderGreeting(new Promise<string | null>(() => {}))
	expect(thinking).toContain('Johnny is thinking of a greeting…')
	expect(thinking).not.toContain('See another greeting →')

	const greeted = renderGreeting(`Hey **${NAME}**, how’s it going?`)
	expect(greeted).toContain('how’s it going?')
	expect(greeted).toContain('See another greeting →')
})
