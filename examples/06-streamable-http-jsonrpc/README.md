# MCP over Streamable HTTP with raw JSON-RPC

No SDK needed: the endpoint takes one JSON-RPC message per POST and answers
with `application/json`. It is stateless, so no `Mcp-Session-Id` has to be
carried between calls, and `initialize` is optional for one-off tool calls.
Notifications get `202` with no body.

The script also shows how the server answers common mistakes: a missing
argument, a stack that is not solved, malformed JSON and a plain GET.

## Run it

```sh
bash examples/06-streamable-http-jsonrpc/session.sh
```

The core call as a single copy-paste command:

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'
```

## Live output

Captured 2026-10-16 01:45 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
--- initialize
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2025-06-18","capabilities":{"tools":{},"resources":{}},"serverInfo":{"name":"pokerdata-ranges","version":"1.5.0"},"instructions":"For exact postflop hand questions prefer explain_combo. For PLO5 (plo5-) postflop packs use get_postflop_node; the high-level postflop tools are hold'em only. For cross-stack, cross-board, or cross-line questions prefer compare_strategies. For texture heuristics use get_board_report. Use low-level node/range tools only when the high-level tools cannot express the request. nlmtt8 is the certified 8-max MTT chip-EV preflop tree (1bb BB-ante). Never present cash solver data as tournament, ICM, PKO, satellite, or multiway advice. ICM, PKO, and satellite remain unsupported. Treat coverage.status=unsupported as a hard stop and disclose nearest/aggregated coverage. Hand histories are uploaded at the hosted page from get_upload_link (resource pokerdata://hands/upload). upload_hand_history is only for a short paste."}}
[HTTP 200]

--- notifications/initialized (no reply body expected)

[HTTP 202]

--- tools/list (names only)
29 tools: list_games, get_range, get_node, get_config, list_spots, list_postflop_packs, get_postflop_node, explain_combo, get_board_report, compare_strategies, list_datasets, get_tree_docs, get_range_metadata, get_exploitability, get_postflop_range, find_hands, get_hand_results, get_session_summary, list_my_sessions, get_tournament_results, list_my_opponents, get_opponent_notes, get_opponent_limp_range, enqueue_solve, get_queued_solve, list_queued_solves, list_library_solutions, get_upload_link, upload_hand_history

--- resources/list
{"jsonrpc":"2.0","id":3,"result":{"resources":[{"uri":"pokerdata://hands/upload","name":"Hand history upload","description":"Hosted page where a person drops hand-history files. Primary upload path. Read this resource for a URL, signed for the caller when possible.","mimeType":"application/json"}]}}
[HTTP 200]

--- tools/call get_node (UTG first-in, AKo)
{"jsonrpc":"2.0","id":4,"result":{"content":[{"type":"text","text":"{\"game\":\"nl\",\"version\":2,\"stack\":100,\"history\":\"UTG\",\"actor\":\"UTG\",\"continuingCombos\":239.56,\"hand\":\"AKo\",\"actions\":[{\"action\":\"Fold\",\"kind\":\"fold\",\"combos\":1086.44,\"frequency\":0,\"evSb\":0},{\"action\":\"60%\",\"kind\":\"raise\",\"sizePct\":60,\"combos\":239.56,\"sizeBb\":2.5,\"sizePctPot\":60,\"frequency\":1,\"evSb\":1.98}]}"}]}}
[HTTP 200]

--- tools/call with a missing argument
{"jsonrpc":"2.0","id":5,"result":{"content":[{"type":"text","text":"spot is required"}],"isError":true}}
[HTTP 200]

--- tools/call at a stack that is not solved (25bb)
{"jsonrpc":"2.0","id":6,"result":{"content":[{"type":"text","text":"{\"error\":\"nl-ranges: no bundle for 25bb / UTG\"}"}],"isError":true}}
[HTTP 200]

--- malformed JSON
{"jsonrpc":"2.0","id":null,"error":{"code":-32700,"message":"Parse error"}}
[HTTP 400]

--- GET (browsers, health checks)
{"error":"POST JSON-RPC to this URL. A browser visit is not a tool call.","docs":"https://pokerdata.io/api#mcp"}
[HTTP 405]
```
