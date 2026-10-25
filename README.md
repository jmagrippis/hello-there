# Hello There

![Playwright](https://github.com/jmagrippis/hello-there/actions/workflows/playwright.yaml/badge.svg)

Greet your friends using generative AI!

Visit `/<their name>` and Johnny greets them with a pun on their name. The first visit asks [Claude Sonnet 5.5](https://www.anthropic.com/claude/sonnet) to write the greeting, and every visit after that reads it back from Cloudflare KV.

## Notable Tech Featured

- [SvelteKit](https://svelte.dev)
- [Cloudflare Workers](https://github.com/cloudflare/workers-sdk#readme), with a [KV namespace](https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces) storing greetings
- [Claude](https://platform.claude.com/docs/en/about-claude/models/overview) via the [Anthropic TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript#readme)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vite+](https://viteplus.dev/guide) for dev, build, test, lint and format
- [Takumi](https://takumi.kane.tw/docs/) to render each name's open-graph card

## Related video content

Johnny often livestreams development over at [YouTube](https://www.youtube.com/@jmagrippis)

Check out [the video tutorial specifically about this project](https://www.youtube.com/watch?v=Uw5GZg96kD8)! It covers the original 2023 version.

## Running locally

You need the Node and pnpm versions in `mise.toml` (`mise install` sorts both out), then:

```sh
pnpm install
cp .env.example .env # then fill in your Anthropic API key and admin credentials
vp dev
```

Then visit [http://localhost:5173](http://localhost:5173) 🚀

KV runs locally through Wrangler, so nothing touches your Cloudflare account until you deploy. Without an API key the site still works: greetings already stored in local KV render, and new names get a friendly "lost for words" message.

Before calling a change done, run everything CI runs:

```sh
vp run sanity
```

## Deploying

```sh
pnpm wrangler secret put ANTHROPIC_API_KEY
pnpm wrangler secret put ADMIN_USERNAME
pnpm wrangler secret put ADMIN_PASSWORD
pnpm run deploy
```

The first deploy creates the `GREETINGS` KV namespace and writes its id into `wrangler.jsonc`: commit that change.
