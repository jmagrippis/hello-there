<script lang="ts">
	import {page} from '$app/state'
</script>

<section class="container flex grow flex-col items-center justify-center px-2 py-4">
	<h1 class="mb-4 text-4xl">We’ve had an error 😱</h1>
	<div class="flex max-w-prose flex-col items-center gap-2 text-xl lg:gap-4 lg:text-2xl">
		{#if page.status === 404}
			<p>
				We couldn’t find a page for <strong>{page.url.pathname}</strong>...
			</p>
		{:else}
			<p>{page.error?.message ?? 'Unknown error, how unexpected!'}</p>
		{/if}
		<p><a href="/">Go back to the homepage?</a></p>
	</div>
</section>
