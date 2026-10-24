import {Marked} from 'marked'

const HTML_ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
}

const escapeHtml = (text: string) =>
	text.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character])

// greetings are model output steered by a visitor-chosen name, and get rendered with {@html},
// so markup they carry must show up as text rather than run
const marked = new Marked({
	renderer: {
		html: ({text}) => escapeHtml(text),
		link({tokens}) {
			return this.parser.parseInline(tokens)
		},
		image: ({text}) => escapeHtml(text),
	},
})

export const parseMarkdown = (markdown: string) => marked.parse(markdown, {async: false})
