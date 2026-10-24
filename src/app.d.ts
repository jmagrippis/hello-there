import 'unplugin-icons/types/svelte'
import type {Theme} from '#lib/theme'

declare global {
	namespace App {
		interface Locals {
			theme: Theme
		}
		interface PageData {
			theme: Theme
			meta?: {
				title: string
				description: string
			}
		}
	}
}

export {}
