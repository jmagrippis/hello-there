<script lang="ts">
	import {enhance} from '$app/forms'

	import Greeting from '#lib/components/Greeting.svelte'
	import {Button} from '#lib/components/ui/button'
	import * as Field from '#lib/components/ui/field'
	import {Textarea} from '#lib/components/ui/textarea'

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
		class="text-lg"
		use:enhance={() =>
			({update}) =>
				update({reset: false})}
	>
		<Field.Group class="gap-4">
			<Field.Field>
				<Field.Label for="greeting">
					Greeting, with the pun wrapped in **double asterisks**
				</Field.Label>
				<Textarea
					id="greeting"
					name="greeting"
					rows={8}
					value={draft}
					oninput={(event) => (draft = event.currentTarget.value)}
					class="field-sizing-fixed"
				/>
			</Field.Field>

			{#if form?.missing}
				<p role="alert">A greeting can’t be empty.</p>
			{:else if form?.saved}
				<p role="status">Saved ✓</p>
			{/if}

			<Field.Field orientation="horizontal">
				<Button type="submit" variant="secondary">Save</Button>
				<Button type="submit" variant="secondary" formaction="?/delete">Delete</Button>
				<a href="/{encodeURIComponent(data.name)}">View the page</a>
			</Field.Field>
		</Field.Group>
	</form>

	<h2 class="mt-8 mb-4 text-2xl">Preview</h2>
	<div class="flex flex-col gap-8 text-3xl font-light">
		<Greeting greeting={draft} />
	</div>
</section>
