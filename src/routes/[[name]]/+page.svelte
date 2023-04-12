<script lang="ts">
	import type {PageData} from './$types'

	export let data: PageData
</script>

<div
	class="container flex grow flex-col items-center justify-center gap-8 px-2 py-8 text-3xl font-light"
>
	<p>
		{data.greeting}
	</p>
</div>
