import {render} from 'takumi-js'

import {OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH} from '../src/lib/meta'

// the dark palette from `src/app.css`, since the card has no cascade to read it from
const SURFACE_COLOR = 'hsl(330deg 90% 6%)'
const COPY_COLOR = 'hsl(330deg 100% 97%)'
const EMPHASIS_COLOR = 'hsl(158deg 78% 60%)'

const card = `
	<div style="display:flex;align-items:center;gap:64px;width:100%;height:100%;padding:64px;background-color:${SURFACE_COLOR};color:${COPY_COLOR};font-family:Grandstander,'Noto Emoji';font-size:64px">
		<div style="font-size:160px">👋</div>
		<div style="display:flex;flex-direction:column;gap:24px">
			<div>Hello <span style="color:${EMPHASIS_COLOR}">there</span>!</div>
			<div style="font-size:32px">Open for a personalised greeting by Johnny 🙂</div>
		</div>
	</div>`

export const renderOgImage = async (fonts: Buffer[]) =>
	Buffer.from(
		await render(card, {
			width: OG_IMAGE_WIDTH,
			height: OG_IMAGE_HEIGHT,
			format: 'png',
			fonts,
			emoji: 'from-font',
		}),
	)
