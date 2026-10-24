import {expect, it} from 'vite-plus/test'

import {parseMarkdown} from './markdown'

it('renders the emphasis greetings lean on for their puns', () => {
	expect(parseMarkdown('Well *hello* there, **Johnny**!')).toBe(
		'<p>Well <em>hello</em> there, <strong>Johnny</strong>!</p>\n',
	)
})

it('shows raw HTML from the model as text instead of running it', () => {
	const html = parseMarkdown(
		'Hi <script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n<div onclick="alert(1)">hey</div>',
	)

	expect(html).not.toMatch(/<(script|img|div)/)
	expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
	expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;')
})

it('keeps link text but drops hrefs, so no javascript: URL reaches the page', () => {
	const html = parseMarkdown(
		'[click *me*](javascript:alert(1)) and ![pic](https://example.com/x.png)',
	)

	expect(html).toBe('<p>click <em>me</em> and pic</p>\n')
})
