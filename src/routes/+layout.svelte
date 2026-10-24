<script lang="ts">
	import '@fontsource-variable/grandstander'
	import '@fontsource/noto-color-emoji/emoji.css'
	import {page} from '$app/state'

	import '../app.css'

	import Footer from '#lib/components/Footer/Footer.svelte'
	import Header from '#lib/components/Header/Header.svelte'
	import {
		OG_IMAGE_ALT,
		OG_IMAGE_HEIGHT,
		OG_IMAGE_PATH,
		OG_IMAGE_WIDTH,
		SITE_DESCRIPTION,
		SITE_NAME,
	} from '#lib/meta'

	import type {LayoutProps} from './$types'

	let {children}: LayoutProps = $props()

	let title = $derived(page.data.meta?.title ?? SITE_NAME)
	let description = $derived(page.data.meta?.description ?? SITE_DESCRIPTION)
	let ogImageUrl = $derived(new URL(OG_IMAGE_PATH, page.url.origin).href)

	$effect(() => {
		// Playwright waits for this before interacting, so it never races hydration
		document.documentElement.dataset.testid = 'hydrated'
	})
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
	<meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
	<meta property="og:image:alt" content={OG_IMAGE_ALT} />

	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Header />
<main class="flex grow flex-col">
	{@render children()}
</main>
<Footer />
