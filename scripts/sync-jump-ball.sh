#!/usr/bin/env bash
#
# Builds the Jump Ball game and copies the output into static/games/jump-ball,
# where Hugo publishes it verbatim at /games/jump-ball/.
#
# usage: scripts/sync-jump-ball.sh [path-to-game-repo]
#   The game repo defaults to ../double-dribble-ex (next to this repo).

set -euo pipefail

BLOG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GAME_DIR="$(cd "${1:-$BLOG_DIR/../double-dribble-ex}" && pwd)"
DEST_DIR="$BLOG_DIR/static/games/jump-ball"

echo "Building game in $GAME_DIR..."
cd "$GAME_DIR"
if [ ! -d node_modules ]; then
    npm ci
fi
# A relative base keeps asset URLs working when served from a subpath.
npx vite build --base=./

echo "Copying build to $DEST_DIR..."
rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"
cp -R dist/. "$DEST_DIR/"

echo "Done. Review and commit the changes under static/games/jump-ball."
