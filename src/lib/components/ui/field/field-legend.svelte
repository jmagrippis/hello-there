<script lang="ts">
	import type {HTMLAttributes} from 'svelte/elements'

	import {cn, type WithElementRef} from '#lib/utils.js'

	let {
		ref = $bindable(null),
		class: className,
		variant = 'legend',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
		variant?: 'legend' | 'label'
	} = $props()
</script>

<legend
	bind:this={ref}
	data-slot="field-legend"
	data-variant={variant}
	class={cn('mb-3 font-medium', className)}
	{...restProps}
>
	{@render children?.()}
</legend>
