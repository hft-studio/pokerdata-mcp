#!/usr/bin/env bash
# "What does the button open at 100bb in 6-max NL cash?" Free, no key.
#   bash examples/02-btn-open-range/btn-open.sh
set -euo pipefail
source "$(dirname "$0")/../lib/mcp.sh"

# 1. Find the spot name. Folded to the BTN is one decision deep.
mcp_call list_spots '{"game":"nl","stack":100,"contains":"CO_Fold_BTN","depth":1,"limit":3}'

# 2. BTN's first decision: every action with combos (whole range).
mcp_call get_node '{"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_Fold_BTN"}'

# 3. The opening range itself. Rows are [hand, frequency, evSb].
mcp_call get_range '{"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%"}' --array 8

# 4. One hand that mixes: A3o.
mcp_call get_range '{"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%","hand":"A3o"}'
