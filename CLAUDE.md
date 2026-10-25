# CLAUDE.md

The dev server is always running in another terminal at http://localhost:5173. Never start a server, and never check whether this is a git repository.

## Workflow

- Use `vp` (Vite+), not `pnpm` scripts.
- A task that changed code is done when related specs and tests are updated and `vp run sanity` passes. It always passes before you start, so a failure is yours.
- A PostToolUse hook runs `vp lint --fix` and `vp fmt` on every file you edit. Never format by hand or chase whitespace: it is never a formatting issue.
- After adding a dependency, run `vp update -r --latest`.

## Code

- Type everything accurately: no `any` or similar escape hatches. `type`, never `interface`.
- Single source of truth: derive strings and arrays instead of hardcoding them.
- Arrow functions over function declarations.
- `null`, never an explicit `undefined`: call `fn()`, not `fn(undefined)`.
- No `console.log` in committed code: use `console.info`, `console.warn` or `console.error`.
- Time with `performance.now()`, not `Date.now()`.
- Never convert between curly and straight apostrophes. If you think one breaks compilation, ask.
- Comments only for a non-obvious why, never to restate the next line. Prefer a better name.
- Tailwind classes over inline styles and `<style>` blocks.
- Palette changes in `src/app.css` must be mirrored in `src/lib/server/ogImage.ts`.
- Native `<form>`s for GET (filtering, pagination) and POST (mutations), via SvelteKit Remote Functions `form` with Zod. Remote functions are not enabled in `vite.config.ts`.
- Every page route has a `+page.server.ts` whose `load` returns `meta` with a `title` and a long, accurate SEO `description`. The optional `image` comes from `ogImagePath(name)`.
- No layout shift: give images a width and height.

## Tests

Every Playwright spec navigates to a page, then waits for hydration, because Playwright otherwise acts before listeners attach:

```ts
await expect(page.getByTestId('hydrated')).toBeVisible()
```

- That is the only sanctioned test id. Never add a `data-testid` or call `getByTestId` for anything else: use accessible locators, confirmed with the Playwright MCP.
- One test per realistic user story (see this, type, click, see that), not one test per assertion.
- Never `waitForTimeout`: rely on assertion auto-waiting.
- Playwright runs against the built Worker on port 4173, so `vp build` before `vp run playwright`.
- Every test, Vitest included, must catch a bug TypeScript can't and have a realistic way to fail. No `typeof`, `toBeDefined` or `toHaveProperty` checks.
- Don't write source code just for tests.

## MCP servers

- Svelte: `list-sections`, then `get-documentation` for every relevant section. Run `svelte-autofixer` on all Svelte code you write until it reports nothing beyond experimental features.
- Playwright: after user-facing changes, verify the UX through the accessibility tree until it is right. Never take screenshots.
- Cloudflare docs: for infrastructure research, and for bugs that only appear when deployed.
