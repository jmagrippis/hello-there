import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'

import type {Plugin} from 'vite'

import {OG_IMAGE_PATH} from '../src/lib/meta'
import {renderOgImage} from './ogImage'

const FONT_PATHS = ['scripts/fonts/Grandstander-Regular.ttf', 'scripts/fonts/NotoEmoji-Regular.ttf']

// A Worker would need a 4MB wasm renderer and blow the free plan's CPU limit drawing
// cards per request, so the card is drawn once here, before SvelteKit copies `static/`.
export const ogImages = (): Plugin => ({
	name: 'hello-there-og-images',
	apply: 'build',
	// `buildStart` fires per environment, so without this both client and ssr
	// render the card and race to write the same file
	applyToEnvironment: (environment) => environment.name === 'client',
	async buildStart() {
		const fonts = await Promise.all(FONT_PATHS.map((fontPath) => readFile(fontPath)))
		const target = path.join('static', OG_IMAGE_PATH)

		await mkdir(path.dirname(target), {recursive: true})
		await writeFile(target, await renderOgImage(fonts))

		console.info(`[og-images] rendered ${OG_IMAGE_PATH}`)
	},
})
