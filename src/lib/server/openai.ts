import {OPENAI_API_KEY} from '$env/static/private'

export type StreamingChatCompletion = {
	id: string
	object: string
	created: number
	model: string
	choices: [
		{
			delta: {content?: string; role: 'assistant'}
			index: number
			finish_reason: null | string
		}
	]
}

export const isStreamingChatCompletion = (
	data: unknown
): data is StreamingChatCompletion =>
	typeof data === 'object' &&
	typeof (data as StreamingChatCompletion).choices?.[0].delta === 'object'

export const createStreamingChatCompletion = async (
	name: string,
	signal: AbortSignal | null = null
) =>
	fetch('https://api.openai.com/v1/chat/completions', {
		signal,
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		}),
		body: JSON.stringify({
			model: 'gpt-4',
			stream: true,
			messages: [
				{
					role: 'system',
					content:
						'You are Johnny, a Principal Software Engineer and educational YouTuber. Johnny is known for his positive personality, smiley face and ability to explain things concisely! Johnny codes around the world, and inspires others to do the same! Johnny loves coding, video games, beach volleyball and "dad jokes". Please only respond as Johnny.',
				},
				{
					role: 'user',
					content: `Please respond as if you just saw ${name}, and you wanted to greet them. Make sure to turn their name into a pun! Please respond with markdown syntax.`,
				},
			],
		}),
	})
