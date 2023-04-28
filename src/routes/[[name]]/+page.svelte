<script lang="ts">
	import {marked} from 'marked'
	import {onMount} from 'svelte'

	export let data

	let cursor = false
	let streamedGreeting = ''
	$: greeting = data.dbGreeting || marked(streamedGreeting)

	onMount(async () => {
		if (greeting) return

		cursor = true

		const response = await fetch('/api/greet', {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify({name: data.name}),
		})

		if (response.ok && response.body) {
			const reader = response.body
				.pipeThrough(new TextDecoderStream())
				.getReader()

			while (true) {
				const {value, done} = await reader.read()
				if (done) break
				if (!value) continue

				streamedGreeting += value
			}

			cursor = false
		}
	})
</script>

<div
	class="container flex grow flex-col items-center justify-center gap-8 px-2 py-8 text-3xl font-light"
	class:cursor
>
	{#if greeting}
		{@html greeting}
	{:else}
		<p class="italic text-copy-muted">Johnny is typing...</p>
	{/if}
</div>

<style lang="postcss">
	div :global(em),
	div :global(strong) {
		@apply text-emphasis;
	}

	.cursor :global(p:last-child::after) {
		content: '';
		position: absolute;
		display: inline-block;
		width: 12px;
		height: 32px;
		animation: blink 0.8s linear infinite;
		animation-timing-function: steps(1);
		@apply bg-emphasis;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}
</style>
