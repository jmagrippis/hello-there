<script lang="ts">
	import {page} from '$app/state'
	import {MediaQuery} from 'svelte/reactivity'
	import IconYouTube from '~icons/brand/youtube'

	import type {Theme} from '#lib/theme'
	import {setTheme} from '#lib/theme.remote'

	import ThemeToggleIcon from './ThemeToggleIcon.svelte'

	const prefersDark = new MediaQuery('prefers-color-scheme: dark', false)

	let logoTag = $derived(page.url.pathname === '/' ? 'h1' : 'div')
	let theme = $derived(page.data.theme)
	let nextTheme: Theme = $derived.by(() => {
		switch (theme) {
			case 'dark':
				return 'light'
			case 'light':
				return 'dark'
			case 'auto':
				return prefersDark.current ? 'light' : 'dark'
		}
	})

	$effect(() => {
		document.documentElement.dataset.theme = theme
	})
</script>

<header class="relative z-10 bg-surface-2">
	<div class="container flex items-center justify-between px-2 py-4">
		<svelte:element this={logoTag}>
			<a href="/" class="text-2xl no-underline" aria-label="Hello there">👋</a>
		</svelte:element>
		<nav class="flex items-center gap-4">
			<a href="/about">About</a>
			<a
				href="https://www.youtube.com/@jmagrippis"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Johnny’s YouTube channel"
			>
				<IconYouTube class="w-7 hover:text-emphasis-hover" />
			</a>
			<form
				{...setTheme.enhance(async ({submit}) => {
					document.documentElement.dataset.theme = nextTheme
					try {
						await submit()
					} catch {
						document.documentElement.dataset.theme = theme
					}
				})}
			>
				<button
					{...setTheme.fields.theme.as('submit', nextTheme)}
					class="w-8"
					aria-label={`Switch to the ${nextTheme} theme`}
				>
					<ThemeToggleIcon />
				</button>
			</form>
		</nav>
	</div>
</header>
