import {fail, redirect} from '@sveltejs/kit'

import {deleteGreeting, getGreeting, saveEditedGreeting} from '#lib/server/greetings'
import {assertGreetable} from '#lib/server/name'

import type {Actions, PageServerLoad} from './$types'

export const load: PageServerLoad = async ({params}) => {
	assertGreetable(params.name)

	return {
		meta: {
			title: `${params.name} | Admin | Hello there 👋`,
			description: `Edit the greeting stored for ${params.name}.`,
		},
		name: params.name,
		greeting: (await getGreeting(params.name)) ?? '',
	}
}

export const actions = {
	save: async ({params, request}) => {
		assertGreetable(params.name)

		const greeting = (await request.formData()).get('greeting')
		if (typeof greeting !== 'string' || !greeting.trim()) {
			return fail(400, {missing: true})
		}

		await saveEditedGreeting(params.name, greeting.trim())

		return {saved: true}
	},
	delete: async ({params}) => {
		await deleteGreeting(params.name)

		redirect(303, '/admin')
	},
} satisfies Actions
