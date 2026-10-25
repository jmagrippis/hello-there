export const SITE_NAME = 'Hello there 👋'

export const SITE_DESCRIPTION =
	'Welcome to the official app which uses generative AI to greet you just like Johnny would 👋 Have a lovely day!'

export const DEFAULT_NAME = 'World'

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

export const ogImagePath = (name: string) => `/og/${encodeURIComponent(name)}.png`
