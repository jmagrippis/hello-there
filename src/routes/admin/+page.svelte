<script lang="ts">
	import {enhance} from '$app/forms'
	import type {KeyboardEventHandler} from 'svelte/elements'

	import {Button} from '#lib/components/ui/button'
	import * as Field from '#lib/components/ui/field'
	import {Input} from '#lib/components/ui/input'
	import * as NativeSelect from '#lib/components/ui/native-select'
	import {Switch} from '#lib/components/ui/switch'
	import * as Table from '#lib/components/ui/table'

	import type {PageProps} from './$types'

	let {data}: PageProps = $props()

	// keeps search and sort across submissions without JavaScript
	let poolAction = $derived(`?${new URLSearchParams({q: data.query, sort: data.sort})}&/pool`)

	const dateFormat = new Intl.DateTimeFormat('en-GB', {dateStyle: 'medium', timeZone: 'UTC'})

	// bits-ui cancels Enter and Space to toggle the switch itself, which also cancels the form submit
	const submitOnToggleKey: KeyboardEventHandler<HTMLButtonElement> = (event) => {
		if (event.key !== 'Enter' && event.key !== ' ') return
		event.preventDefault()
		event.currentTarget.click()
	}
</script>

{#snippet date(timestamp: number)}
	<time datetime={new Date(timestamp).toISOString()}>{dateFormat.format(timestamp)}</time>
{/snippet}

<section class="container grow px-2 py-4 text-lg">
	<h1 class="my-4 text-4xl">Greetings</h1>

	<form method="GET" class="mb-6">
		<Field.Group class="flex-row flex-wrap items-end gap-4">
			<Field.Field class="w-auto">
				<Field.Label for="name-query">Name</Field.Label>
				<Input id="name-query" type="search" name="q" value={data.query} />
			</Field.Field>
			<Field.Field class="w-auto">
				<Field.Label for="sort">Sort by</Field.Label>
				<NativeSelect.Root id="sort" name="sort">
					{#each Object.entries(data.sortLabels) as [value, label] (value)}
						<NativeSelect.Option {value} selected={value === data.sort}>{label}</NativeSelect.Option
						>
					{/each}
				</NativeSelect.Root>
			</Field.Field>
			<Button type="submit" variant="secondary">Search</Button>
		</Field.Group>
	</form>

	{#if data.canWriteNew}
		<p class="mb-6">
			<a href="/admin/{encodeURIComponent(data.query)}">Write a greeting for “{data.query}”</a>
		</p>
	{/if}

	{#if data.greetings.length}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Greeting</Table.Head>
					<Table.Head>Created</Table.Head>
					<Table.Head>Edited</Table.Head>
					<Table.Head>Random pool</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.greetings as { name, preview, createdAt, editedAt, inRandomPool } (name)}
					<Table.Row>
						<Table.Cell><a href="/admin/{encodeURIComponent(name)}">{name}</a></Table.Cell>
						<Table.Cell class="font-light whitespace-normal">{preview}</Table.Cell>
						<Table.Cell>{@render date(createdAt)}</Table.Cell>
						<Table.Cell>
							{#if editedAt}{@render date(editedAt)}{:else}—{/if}
						</Table.Cell>
						<Table.Cell>
							<form method="POST" action={poolAction} use:enhance>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="include" value={String(!inRandomPool)} />
								<!-- ignores bits-ui's own toggle, so the switch only moves once the server has saved -->
								<Switch
									type="submit"
									bind:checked={() => inRandomPool, () => {}}
									onkeydown={submitOnToggleKey}
									aria-label="Show {name} in random greetings"
								/>
							</form>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<p>No greetings {data.query ? `matching “${data.query}”` : 'yet'}.</p>
	{/if}
</section>
