#!/usr/bin/env bash
# PLO, PLO 9-max, MTT and postflop. Coverage and docs tools are free; the data
# calls need a key:
#   POKERDATA_API_KEY=pdk_... bash examples/04-plo-and-paid-games/paid.sh
# Without a key the data calls print the server's key-gate reply.
set -euo pipefail
source "$(dirname "$0")/../lib/mcp.sh"

if [ -z "${POKERDATA_API_KEY:-}" ]; then
  echo "POKERDATA_API_KEY is not set: the free calls return data, the paid calls show the key gate."
  echo
fi

# Free: PLO tree docs and published exploitability.
mcp_call get_tree_docs '{"dataset":"plo"}' --array 2 --keys 8
mcp_call get_exploitability '{"game":"plo"}'

# Paid preflop: PLO 6-max, PLO 9-max, NLHE 8-max MTT (chip EV, 1bb BB ante).
mcp_call get_node '{"game":"plo","stack":100,"history":"UTG"}' --array 4
mcp_call get_config '{"game":"plo9","stack":100}' --array 9
mcp_call get_node '{"game":"nlmtt8","stack":30,"history":"UTG"}' --array 4

# Paid postflop: CO opens, BB calls, flop 3h 3d 2s.
mcp_call get_postflop_node '{"pack":"nlhe-srp-co-vs-bb-100bb","board":"3h 3d 2s"}' --array 4
mcp_call explain_combo '{"pack":"nlhe-srp-co-vs-bb-100bb","board":"3h 3d 2s","combo":"AsKh"}' --array 4
