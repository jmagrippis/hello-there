<script lang="ts">
	import '@fontsource-variable/grandstander'
	import '@fontsource/noto-color-emoji/emoji.css'

	import '../app.css'
	import {browser} from '$app/environment'
	import {page} from '$app/stores'
	import Header from '$lib/components/Header/Header.svelte'
	import Footer from '$lib/components/Footer/Footer.svelte'
	import {theme} from '$lib/stores/theme'

	export let data

	$: title = $page.data.meta?.title ?? data.defaultMeta.title
	$: description = $page.data.meta?.description ?? data.defaultMeta.description
	$: image = $page.data.meta?.image ?? data.defaultMeta.image

	$theme = data.theme
	$: browser && (document.documentElement.dataset.theme = $theme)
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Emoji of the day" />
	<meta property="og:url" content={$page.url.href} />

	<meta property="og:image" content={image.url} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image:alt" content={image.alt} />
</svelte:head>

<Header />
<slot />
<Footer />
