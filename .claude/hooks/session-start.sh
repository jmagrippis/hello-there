#!/bin/bash
# Cloud sessions start from a bare container: an older Node, no dependencies and
# no dev server, all of which CLAUDE.md takes for granted.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
	exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# stdout becomes session context, so only the summary goes there
exec 3>&1 1>&2

# ~/.local/bin comes before the container's own Node on PATH, so this Node and `vp`
# also reach hooks and MCP servers, not just the shell
bin_dir="$HOME/.local/bin"
node_version=$(cat .node-version)
node_dir="$HOME/.local/node-v$node_version"
if [ ! -x "$node_dir/bin/node" ]; then
	mkdir -p "$node_dir"
	curl -fsSL "https://nodejs.org/dist/v$node_version/node-v$node_version-linux-x64.tar.xz" |
		tar -xJ --strip-components=1 -C "$node_dir"
fi
mkdir -p "$bin_dir"
for tool in node npm npx corepack; do
	ln -sf "$node_dir/bin/$tool" "$bin_dir/$tool"
done
printf '#!/bin/sh\nexec "%s/node_modules/.bin/vp" "$@"\n' "$CLAUDE_PROJECT_DIR" >"$bin_dir/vp"
chmod +x "$bin_dir/vp"
export PATH="$bin_dir:$PATH"

# test-only, as in CI, so the admin specs can log in; the environment's own variables win
export ADMIN_USERNAME="${ADMIN_USERNAME:-cloud-session}"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-cloud-session-only-password}"
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
	cat >>"$CLAUDE_ENV_FILE" <<-EOF
		export ADMIN_USERNAME="\${ADMIN_USERNAME:-$ADMIN_USERNAME}"
		export ADMIN_PASSWORD="\${ADMIN_PASSWORD:-$ADMIN_PASSWORD}"
	EOF
fi

pnpm install --frozen-lockfile

# needs cdn.playwright.dev in the environment's allowed domains
browsers="Playwright browsers installed"
if ! vp exec playwright install chromium-headless-shell firefox webkit ffmpeg; then
	browsers="Playwright browsers NOT installed: allow cdn.playwright.dev in the environment's network settings"
fi

# the Playwright MCP asks for Chrome Beta; the container has Chromium, which refuses
# to run as root inside its sandbox
chrome_beta=/opt/google/chrome-beta/chrome
if [ ! -e "$chrome_beta" ] && [ -x /opt/pw-browsers/chromium ]; then
	mkdir -p "$(dirname "$chrome_beta")"
	printf '#!/bin/sh\nexec /opt/pw-browsers/chromium --no-sandbox "$@"\n' >"$chrome_beta"
	chmod +x "$chrome_beta"
fi

dev_server="dev server already running on http://localhost:5173"
if ! curl -sf -o /dev/null http://localhost:5173; then
	setsid nohup vp dev --strictPort >/tmp/vp-dev.log 2>&1 </dev/null &
	for _ in $(seq 30); do
		curl -sf -o /dev/null http://localhost:5173 && break
		sleep 1
	done
	dev_server="dev server started on http://localhost:5173 (log: /tmp/vp-dev.log)"
	curl -sf -o /dev/null http://localhost:5173 ||
		dev_server="dev server FAILED to start: see /tmp/vp-dev.log"
fi

echo "Node $(node --version), dependencies installed, $browsers, $dev_server." >&3
