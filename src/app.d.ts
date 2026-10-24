import 'unplugin-icons/types/svelte'

declare global {
	namespace App {
		interface PageData {
			meta?: {
				title: string
				description: string
				/** Path of the open-graph card, defaulting to the World greeting's. */
				image?: string
			}
		}
	}
}

export {}
