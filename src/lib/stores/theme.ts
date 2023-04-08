import {writable} from 'svelte/store'

export type Theme = 'light' | 'dark' | 'auto'

export const isValidTheme = (
	theme: FormDataEntryValue | null
): theme is Theme =>
	!!theme && (theme === 'light' || theme === 'dark' || theme === 'auto')

export const theme = writable<Theme>()
