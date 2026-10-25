<script lang="ts">
	import IconDiscord from '~icons/brand/discord'
	import IconGitHub from '~icons/brand/github'
	import IconYouTube from '~icons/brand/youtube'

	import PulsingHeart from './PulsingHeart.svelte'
</script>

<footer class="flex items-center justify-center gap-2 py-2">
	<div class="flex shrink-0 items-center justify-center gap-2">
		Made with
		<PulsingHeart />
		by <a href="https://magrippis.com">jmagrippis</a>
	</div>

	<a
		href="https://www.youtube.com/@jmagrippis"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Johnny’s YouTube channel"
		class="hover:text-emphasis-hover"
	>
		<IconYouTube class="w-5" />
	</a>
	<a
		href="https://github.com/jmagrippis/hello-there"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Check out the source code on GitHub"
		class="hover:text-emphasis-hover"
	>
		<IconGitHub class="w-5" />
	</a>
	<a
		href="https://discord.gg/eR5Q52Sfm3"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Join Johnny’s Discord community!"
		class="hover:text-emphasis-hover"
	>
		<IconDiscord class="w-5" />
	</a>
</footer>
