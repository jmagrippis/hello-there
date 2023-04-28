import {
	createStreamingChatCompletion,
	isStreamingChatCompletion,
} from '$lib/server/openai'
import {setGreeting} from '$lib/server/redis'
import type {RequestHandler} from './$types'

export const POST = (async ({request}) => {
	const {name = 'World'} = await request.json()
	const abortController = new AbortController()

	const stream = new ReadableStream({
		async start(controller) {
			let streaming = true
			let partialResponse = ''

			const response = await createStreamingChatCompletion(
				name,
				abortController.signal
			)

			if (!response.ok || !response.body) {
				controller.enqueue(
					`Hello there **${name}**! 👋 I’m having a bit of trouble generating a punny greeting for you 😱 maybe try again? 🙏`
				)
				console.error(`Could not ask OpenAI to greet ${name}!`)
				controller.close()
				return
			}

			const reader = response.body
				.pipeThrough(new TextDecoderStream())
				.getReader()

			while (streaming) {
				const {value, done} = await reader.read()
				streaming = !done
				if (!value) continue

				try {
					const [, ...jsonStrings] = value.split('data: ')
					jsonStrings.forEach((jsonString) => {
						const json = JSON.parse(jsonString)
						if (
							!isStreamingChatCompletion(json) ||
							!json.choices[0].delta.content
						)
							return

						partialResponse += json.choices[0].delta.content
						controller.enqueue(json.choices[0].delta.content)
					})
				} catch {
					// sometimes we may try to parse something that
					// ain't JSON, but that's fine. Relevant data
					// should always be parse-able as JSON.
				}
			}

			await setGreeting(name, partialResponse)
			controller.close()
		},
		cancel() {
			abortController.abort()
		},
	})

	return new Response(stream, {
		headers: new Headers({
			Connection: 'keep-alive',
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache, must-revalidate',
			'Transfer-Encoding': 'chunked',
		}),
	})
}) satisfies RequestHandler
