<script lang="ts">
	export let data
</script>

<div
	class="container flex grow flex-col items-center justify-center gap-8 px-2 py-8 text-3xl font-light"
>
	{#await data.streamed.greeting}
		<p class="animate-pulse text-8xl">👋</p>
	{:then greeting}
		{@html greeting}
	{/await}
</div>

<style lang="postcss">
	div :global(em),
	div :global(strong) {
		@apply text-emphasis;
	}
</style>
