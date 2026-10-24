<script lang="ts">
	import Greeting from '#lib/components/Greeting.svelte'

	import type {PageProps} from './$types'

	let {data}: PageProps = $props()
</script>

<div
	class="container flex grow flex-col items-center justify-center gap-8 px-2 py-8 text-3xl font-light"
>
	{#await data.greeting}
		<p class="animate-pulse text-8xl">
			<span aria-hidden="true">👋</span>
			<span class="sr-only">Johnny is thinking of a greeting…</span>
		</p>
	{:then greeting}
		{#if greeting}
			<Greeting {greeting} />
		{:else}
			<p>Johnny is lost for words right now 😅 Give it another go in a bit!</p>
		{/if}
	{/await}

	{#if data.hasAnotherGreeting}
		<p class="text-xl">
			<!-- a real navigation, or the client router would render `/random` as a greeting for "random" -->
			<a href="/random?not={encodeURIComponent(data.name)}" data-sveltekit-reload>
				See another greeting →
			</a>
		</p>
	{/if}
</div>
