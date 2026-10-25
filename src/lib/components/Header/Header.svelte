<script lang="ts">
	import {page} from '$app/state'
	import {setMode, setTheme, theme} from 'mode-watcher'
	import IconYouTube from '~icons/brand/youtube'

	import ThemeToggleIcon from './ThemeToggleIcon.svelte'

	let logoTag = $derived(page.url.pathname === '/' ? 'h1' : 'div')

	const toggleTheme = () => {
		const nextTheme = theme.current === 'dark' ? 'light' : 'dark'

		setTheme(nextTheme)
		setMode(nextTheme)
	}
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
			<button class="w-8" onclick={toggleTheme} aria-label="toggle light/dark theme">
				<ThemeToggleIcon class="w-full hover:text-emphasis-hover" />
			</button>
		</nav>
	</div>
</header>
