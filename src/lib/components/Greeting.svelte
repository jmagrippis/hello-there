<script lang="ts">
	import {toParagraphs} from '#lib/greeting'

	type Props = {
		greeting: string
	}

	let {greeting}: Props = $props()

	let paragraphs = $derived(toParagraphs(greeting))
</script>

{#each paragraphs as paragraph, index (index)}
	<p>
		{#each paragraph as { text, isPun }, segmentIndex (segmentIndex)}
			{#if isPun}<strong class="text-emphasis">{text}</strong>{:else}{text}{/if}
		{/each}
	</p>
{/each}
