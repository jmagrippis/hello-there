import {marked} from 'marked'

marked.use({
	langPrefix: '',
	mangle: false,
	headerIds: false,
})

export const parseMarkdown = (md: string) => marked.parse(md)
