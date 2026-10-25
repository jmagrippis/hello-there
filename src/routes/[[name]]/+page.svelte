<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'

	import Greeting from '#lib/components/Greeting.svelte'
	import {Button} from '#lib/components/ui/button'

	import type {PageProps} from './$types'

	let {data}: PageProps = $props()
</script>

<div
	class="container flex grow flex-col items-center justify-center gap-8 px-2 py-8 text-3xl font-light"
>
	{#await data.greeting}
		<div role="progressbar" aria-label="Loading greeting" class="animate-pulse text-8xl">👋</div>
	{:then greeting}
		{#if greeting}
			<Greeting {greeting} />
		{:else}
			<p>Johnny is lost for words right now 😅 Give it another go in a bit!</p>
		{/if}

		{#if data.hasAnotherGreeting}
			<!-- client-side, `/random` would match `[[name]]` -->
			<Button
				href="/random?not={encodeURIComponent(data.name)}"
				data-sveltekit-reload
				size="lg"
				class="text-base"
			>
				See another greeting
				<ArrowRightIcon data-icon="inline-end" />
			</Button>
		{/if}
	{/await}
</div>
