# MCP through the npm stdio bridge (`npx pokerdata-mcp`)

Clients that only speak stdio (Claude Desktop, many agent frameworks) run the
published bridge: `npx -y pokerdata-mcp`. It reads newline-delimited JSON-RPC
on stdin, forwards each message to `https://pokerdata.io/api/mcp` and writes
the reply to stdout. Set `POKERDATA_API_KEY` in its environment to unlock the
keyed tools.

This script pipes a full session (initialize, initialized, tools/list, two
tool calls) through the real npm package and prints one line per reply.

## Run it

```sh
bash examples/05-npx-stdio-bridge/bridge.sh
```

The core call as a single copy-paste command:

```sh
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"nl","stack":100,"history":"UTG","hand":"AKo"}}}' \
  | npx -y pokerdata-mcp
```

## Live output

Captured 2026-10-16 01:45 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
id 1 initialize -> {"name":"pokerdata-ranges","version":"1.5.0"}
id 2 tools/list -> 29 tools: list_games, get_range, get_node, get_config, list_spots, list_postflop_packs, get_postflop_node, explain_combo, get_board_report, compare_strategies, list_datasets, get_tree_docs, get_range_metadata, get_exploitability, get_postflop_range, find_hands, get_hand_results, get_session_summary, list_my_sessions, get_tournament_results, list_my_opponents, get_opponent_notes, get_opponent_limp_range, enqueue_solve, get_queued_solve, list_queued_solves, list_library_solutions, get_upload_link, upload_hand_history
id 3 tools/call -> {"game":"nl","version":2,"stack":100,"history":"UTG_Fold_HJ_Fold_CO_Fold_BTN","actor":"BTN","continuingCombos":550.88,"hand":"K9o","actions":[{"action":"Fold","kind":"fold","combos":775.12,"frequency":0,"evSb":0},{"action":"60%","kind":"raise","sizePct":60,"combos":550.88,"sizeBb":2.5,"sizePctPot":60,"frequency":1,"evSb":0.11}]}
id 4 tools/call -> isError: This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included.
```
