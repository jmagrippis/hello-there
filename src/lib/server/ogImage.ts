import {read} from '$app/server'
import {render} from 'takumi-js'
import {container, text} from 'takumi-js/helpers'

import {OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH} from '#lib/meta'

import grandstander from './fonts/Grandstander-Regular.ttf'
import notoEmoji from './fonts/NotoEmoji-Regular.ttf'

// mirrors the dark palette in `src/app.css`
const SURFACE_COLOR = 'hsl(330deg 90% 6%)'
const COPY_COLOR = 'hsl(330deg 100% 97%)'
const EMPHASIS_COLOR = 'hsl(158deg 78% 60%)'

const card = (name: string) =>
	container({
		style: {
			display: 'flex',
			alignItems: 'center',
			gap: '64px',
			width: '100%',
			height: '100%',
			padding: '64px',
			backgroundColor: SURFACE_COLOR,
			color: COPY_COLOR,
			fontFamily: "Grandstander, 'Noto Emoji'",
			fontSize: '64px',
		},
		children: [
			text('👋', {fontSize: '160px'}),
			container({
				style: {display: 'flex', flexDirection: 'column', gap: '24px'},
				children: [
					container({
						style: {display: 'flex', flexWrap: 'wrap', columnGap: '16px'},
						children: [text('Hello there,'), text(`${name}!`, {color: EMPHASIS_COLOR})],
					}),
					text('Open for a personalised greeting by Johnny 🙂', {fontSize: '32px'}),
				],
			}),
		],
	})

export const renderOgImage = async (name: string) =>
	render(card(name), {
		width: OG_IMAGE_WIDTH,
		height: OG_IMAGE_HEIGHT,
		format: 'png',
		fonts: await Promise.all([grandstander, notoEmoji].map((font) => read(font).arrayBuffer())),
		emoji: 'from-font',
	})
