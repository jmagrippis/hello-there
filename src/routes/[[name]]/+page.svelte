<script lang="ts">
	import type {PageProps} from './$types'

	let {data}: PageProps = $props()
</script>

<div
	class="container flex grow flex-col items-center justify-center gap-8 px-2 py-8 text-3xl font-light [&_em]:text-emphasis [&_strong]:text-emphasis"
>
	{#await data.greeting}
		<p class="animate-pulse text-8xl">
			<span aria-hidden="true">👋</span>
			<span class="sr-only">Johnny is thinking of a greeting…</span>
		</p>
	{:then greeting}
		{#if greeting}
			{@html greeting}
		{:else}
			<p>Johnny is lost for words right now 😅 Give it another go in a bit!</p>
		{/if}
	{/await}
</div>
