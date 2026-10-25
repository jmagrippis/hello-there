import 'unplugin-icons/types/svelte'

declare global {
	namespace App {
		interface PageData {
			meta?: {
				title: string
				description: string
				/** Open-graph card path, defaulting to the World card. */
				image?: string
			}
		}
	}
}

export {}
