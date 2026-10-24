<script lang="ts">
	import {enhance} from '$app/forms'

	import type {PageProps} from './$types'

	let {data}: PageProps = $props()

	// keeps the search and sort when toggling without JavaScript, which reloads the page
	let poolAction = $derived(`?${new URLSearchParams({q: data.query, sort: data.sort})}&/pool`)

	const dateFormat = new Intl.DateTimeFormat('en-GB', {dateStyle: 'medium', timeZone: 'UTC'})
</script>

{#snippet date(timestamp: number)}
	<time datetime={new Date(timestamp).toISOString()}>{dateFormat.format(timestamp)}</time>
{/snippet}

<section class="container grow px-2 py-4">
	<h1 class="my-4 text-4xl">Greetings</h1>

	<form method="GET" class="mb-6 flex flex-wrap items-end gap-4 text-lg">
		<label class="flex flex-col gap-1">
			Name
			<input
				type="search"
				name="q"
				value={data.query}
				class="rounded border border-copy-base/30 bg-surface-2 px-2 py-1"
			/>
		</label>
		<label class="flex flex-col gap-1">
			Sort by
			<select name="sort" class="rounded border border-copy-base/30 bg-surface-2 px-2 py-1">
				{#each Object.entries(data.sortLabels) as [value, label] (value)}
					<option {value} selected={value === data.sort}>{label}</option>
				{/each}
			</select>
		</label>
		<button class="rounded bg-surface-2 px-4 py-1 hover:text-emphasis-hover">Search</button>
	</form>

	{#if data.canWriteNew}
		<p class="mb-6 text-lg">
			<a href="/admin/{encodeURIComponent(data.query)}">Write a greeting for “{data.query}”</a>
		</p>
	{/if}

	{#if data.greetings.length}
		<table class="w-full text-left text-lg">
			<thead>
				<tr>
					<th class="py-2 pr-4">Name</th>
					<th class="py-2 pr-4">Greeting</th>
					<th class="py-2 pr-4">Created</th>
					<th class="py-2 pr-4">Edited</th>
					<th class="py-2">Random pool</th>
				</tr>
			</thead>
			<tbody>
				{#each data.greetings as { name, preview, createdAt, editedAt, inRandomPool } (name)}
					<tr class="border-t border-copy-base/20 align-top">
						<td class="py-2 pr-4"><a href="/admin/{encodeURIComponent(name)}">{name}</a></td>
						<td class="py-2 pr-4 font-light">{preview}</td>
						<td class="py-2 pr-4 whitespace-nowrap">{@render date(createdAt)}</td>
						<td class="py-2 pr-4 whitespace-nowrap">
							{#if editedAt}{@render date(editedAt)}{:else}—{/if}
						</td>
						<td class="py-2">
							<form method="POST" action={poolAction} use:enhance>
								<input type="hidden" name="name" value={name} />
								<button
									name="include"
									value={String(!inRandomPool)}
									aria-pressed={inRandomPool}
									aria-label="Show {name} in random greetings"
									class={[
										'rounded px-3 py-1',
										inRandomPool
											? 'bg-copy-base text-surface-1'
											: 'bg-surface-2 hover:text-emphasis-hover',
									]}
								>
									{inRandomPool ? 'Yes' : 'No'}
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="text-lg">No greetings {data.query ? `matching “${data.query}”` : 'yet'}.</p>
	{/if}
</section>
