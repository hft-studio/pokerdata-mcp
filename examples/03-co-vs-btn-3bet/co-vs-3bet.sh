#!/usr/bin/env bash
# "CO opens, BTN 3-bets, blinds fold. What does CO do with AQo at 100bb?" Free, no key.
#   bash examples/03-co-vs-btn-3bet/co-vs-3bet.sh
set -euo pipefail
source "$(dirname "$0")/../lib/mcp.sh"

# 1. BTN facing the CO open: fold, call or 3-bet (77% pot = 7.51bb).
mcp_call get_node '{"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN"}'

# 2. BTN's 3-bet range.
mcp_call get_range '{"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%"}' --array 8

# 3. CO's options after the 3-bet, whole range.
mcp_call get_node '{"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO"}'

# 4. The same node for AQo only.
mcp_call get_node '{"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO","hand":"AQo"}'

# 5. CO's 4-bet range (95% pot = 23.2bb).
mcp_call get_range '{"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO_95%"}' --array 28
