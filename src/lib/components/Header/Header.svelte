<script lang="ts">
	import {page} from '$app/state'
	import {setMode, setTheme, theme} from 'mode-watcher'
	import IconYouTube from '~icons/brand/youtube'

	import {Button} from '#lib/components/ui/button'

	import ThemeToggleIcon from './ThemeToggleIcon.svelte'

	let logoTag = $derived(page.url.pathname === '/' ? 'h1' : 'div')

	const toggleTheme = () => {
		const nextTheme = theme.current === 'dark' ? 'light' : 'dark'

		setTheme(nextTheme)
		setMode(nextTheme)
	}
</script>

<header class="relative z-10 bg-muted">
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
			<Button
				variant="ghost"
				size="icon-sm"
				onclick={toggleTheme}
				aria-label="toggle light/dark theme"
			>
				<ThemeToggleIcon class="size-8" />
			</Button>
		</nav>
	</div>
</header>
