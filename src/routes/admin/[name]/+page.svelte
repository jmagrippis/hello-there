<script lang="ts">
	import {enhance} from '$app/forms'

	import Greeting from '#lib/components/Greeting.svelte'

	import type {PageProps} from './$types'

	let {data, form}: PageProps = $props()

	let draft = $derived(data.greeting)
</script>

<section class="container grow px-2 py-4">
	<p class="text-lg"><a href="/admin">← All greetings</a></p>
	<h1 class="my-4 text-4xl">Greeting for {data.name}</h1>

	<form
		method="POST"
		action="?/save"
		class="flex flex-col gap-4 text-lg"
		use:enhance={() =>
			({update}) =>
				update({reset: false})}
	>
		<label class="flex flex-col gap-1">
			Greeting, with the pun wrapped in **double asterisks**
			<textarea
				name="greeting"
				rows="8"
				value={draft}
				oninput={(event) => (draft = event.currentTarget.value)}
				class="rounded border border-copy-base/30 bg-surface-2 p-2"></textarea>
		</label>

		{#if form?.missing}
			<p role="alert">A greeting can’t be empty.</p>
		{:else if form?.saved}
			<p role="status">Saved ✓</p>
		{/if}

		<div class="flex flex-wrap items-center gap-4">
			<button class="rounded bg-surface-2 px-4 py-1 hover:text-emphasis-hover">Save</button>
			<button
				formaction="?/delete"
				class="rounded bg-surface-2 px-4 py-1 hover:text-emphasis-hover"
			>
				Delete
			</button>
			<a href="/{encodeURIComponent(data.name)}">View the page</a>
		</div>
	</form>

	<h2 class="mt-8 mb-4 text-2xl">Preview</h2>
	<div class="flex flex-col gap-8 text-3xl font-light">
		<Greeting greeting={draft} />
	</div>
</section>
