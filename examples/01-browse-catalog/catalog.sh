#!/usr/bin/env bash
# Browse what PokerData covers before asking for a strategy. All free, no key.
#   bash examples/01-browse-catalog/catalog.sh
set -euo pipefail
source "$(dirname "$0")/../lib/mcp.sh"

# Every game, its stacks and positions, and what is explicitly unsupported.
mcp_call list_games '{}' --array 10

# Preflop datasets and their bundle counts.
mcp_call list_datasets '{}' --array 3 --keys 9

# 6-max NL table setup at 100bb (seats, blinds, EV unit).
mcp_call get_config '{"game":"nl","stack":100}' --array 6

# Spots one decision deep whose history mentions CO.
mcp_call list_spots '{"game":"nl","stack":100,"contains":"CO","depth":1,"limit":10}'

# Heads-up postflop packs (hold'em only), first three.
mcp_call list_postflop_packs '{"variant":"nlhe"}' --array 3 --keys 9
