# Smoke test results

- Date: 2026-10-16 (run started 2026-10-16T01:58:14.719Z)
- Command: `node examples/smoke-test --markdown examples/SMOKE_RESULTS.md`
- MCP endpoint: https://pokerdata.io/api/mcp
- REST base: https://pokerdata.io/api/v1
- `POKERDATA_API_KEY`: not set (paid checks skipped; keyed tools show the observed key gate)
- Node v22.14.0; npm package pokerdata-mcp@1.0.1

**65 checks: 45 PASS, 10 WARN, 1 FAIL, 9 SKIP.** WARN means the call worked but the response is odd or matches a known open issue; the Observed column says which.

| # | Group | Check | Result | Observed |
|---|---|---|---|---|
| 1 | REST | GET /ranges/openapi.json | WARN | 200, openapi 3.1.0, title "Poker Study AI preflop ranges", servers https://www.pokerstudy.ai, paths: /api/v1/ranges/{game}/node, /api/v1/ranges/{game}/range, /api/v1/ranges/{game}/config (odd: no pokerdata.io server, so generated clients call another host) |
| 2 | REST | GET /ranges/nl/v2 (discovery, no key) | PASS | 200, stacks [20,30,40,50,70,100,150,200], positions ["BB","BTN","CO","HJ","SB","UTG"] |
| 3 | REST | GET /ranges/games (no key) | WARN | 401 This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io… (known issue: REST returns 401 without a key while the same NL data is free over MCP (fix in progress)) |
| 4 | REST | GET /ranges/nl/config?stack=100 (no key) | WARN | 401 This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io… (known issue: REST returns 401 without a key while the same NL data is free over MCP (fix in progress)) |
| 5 | REST | GET /ranges/nl/range?stack=100&spot=UTG_60% (no key) | WARN | 401 This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io… (known issue: REST returns 401 without a key while the same NL data is free over MCP (fix in progress)) |
| 6 | REST | GET /ranges/nl/node?stack=100&history=UTG (no key) | WARN | 401 This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io… (known issue: REST returns 401 without a key while the same NL data is free over MCP (fix in progress)) |
| 7 | REST | GET /ranges/nl/v2/spots?stack=100 (no key) | WARN | 401 This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io… (known issue: REST returns 401 without a key while the same NL data is free over MCP (fix in progress)) |
| 8 | REST | GET /ranges/games (with key) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 9 | REST | GET /ranges/nl/config?stack=100 (with key) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 10 | REST | GET /ranges/nl/range?stack=100&spot=UTG_60% (with key) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 11 | REST | GET /ranges/nl/node?stack=100&history=UTG (with key) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 12 | REST | GET /ranges/plo/config?stack=100 (with key) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 13 | REST | GET /ranges/nl/config?stack=100 (invalid key) | PASS | 401, {"error":"This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api."… |
| 14 | Docs | GET https://pokerdata.io/llms.txt | PASS | 200, text/plain; charset=utf-8, 13388 bytes, first line "# PokerData" |
| 15 | Docs | GET https://pokerdata.io/ranges.md | PASS | 200, text/markdown; charset=utf-8, 4414 bytes, first line "# Preflop ranges contract" |
| 16 | MCP protocol | initialize | PASS | 200, serverInfo {"name":"pokerdata-ranges","version":"1.5.0"}, protocol 2025-06-18 |
| 17 | MCP protocol | notifications/initialized | PASS | 202 |
| 18 | MCP protocol | tools/list (no key) | PASS | 200, 29 tools; matches tools.json: true; every tool has an example: true |
| 19 | MCP protocol | resources/list | PASS | 200, pokerdata://hands/upload |
| 20 | MCP protocol | GET on the MCP endpoint | PASS | 405, {"error":"POST JSON-RPC to this URL. A browser visit is not a tool call.","docs":"https://pokerdata.io/api#mcp"} |
| 21 | MCP protocol | malformed JSON body | PASS | 400, {"jsonrpc":"2.0","id":null,"error":{"code":-32700,"message":"Parse error"}} |
| 22 | MCP protocol | tools/call without an Accept header | PASS | 200, {"game":"nl","version":2,"stack":100,"history":"UTG","actor":"UTG","continuingCombos":239.56,"hand":"AA","actions":[{"ac… |
| 23 | MCP protocol | tools/call with an unknown tool name (no key) | WARN | 200, odd: unknown tool gets the key-gate message instead of an unknown-tool error: "This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs …" |
| 24 | MCP protocol | tools/call with an invalid key on a free tool | WARN | 401, code -32001, "Unauthorized: an API key (pdk_…) is required. Get a free trial key or choose a plan at https://pokerdata.io/app/api." (odd: says a key is required rather than that the key is invalid; a bad key also loses the free tier) |
| 25 | MCP protocol | tools/call with a missing required argument | PASS | 200, isError true, "spot is required" |
| 26 | MCP tools | list_games [free] | PASS | live data, no key; HTTP 200; {"_coverage":{"format":["cash","mtt_chip_ev"],"supportedObjectives":["cash_game_ev","solver_ev","chip_ev"],"su… |
| 27 | MCP tools | list_datasets [free] | PASS | live data, no key; HTTP 200; {"source":"data/tree-docs","generated":"2026-10-13","preflopExploitability":"not available","datasets":[{"id":… |
| 28 | MCP tools | get_tree_docs [free] | PASS | live data, no key; HTTP 200; {"dataset":"nl/v2","source":"data/tree-docs/README.md","preflopExploitability":"not available","coverage":"\| n… |
| 29 | MCP tools | get_exploitability [free] | PASS | live data, no key; HTTP 200; {"game":"nl","dataset":"nl/v2","available":false,"status":"not available","exploitability":null,"iterations":n… |
| 30 | MCP tools | list_postflop_packs [free] | PASS | live data, no key; HTTP 200; {"packs":[{"id":"nlhe-srp-co-vs-bb-100bb","title":"CO opens, BB calls · 100bb","preflopLine":"CO opens, BB cal… |
| 31 | MCP tools | get_config [free] | PASS | live data, no key; HTTP 200; {"schemaVersion":1,"units":{"stack":"bb","stacks":"bb","blinds":"bb","ante":"bb","sizeBb":"bb","openSizes":"bb… |
| 32 | MCP tools | list_spots [free] | PASS | live data, no key; HTTP 200; {"game":"nl","stack":100,"total":9270,"matched":4,"offset":0,"returned":4,"nextOffset":null,"spots":[{"history… |
| 33 | MCP tools | get_range [free] | PASS | live data, no key; HTTP 200; {"game":"nl","version":2,"stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%","actor":"BTN","combos":550.88,"… |
| 34 | MCP tools | get_node [free] | PASS | live data, no key; HTTP 200; {"game":"nl","version":2,"stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO","actor":"C… |
| 35 | MCP tools | get_range_metadata [free] | PASS | live data, no key; HTTP 200; {"game":"nl","dataset":"nl/v2","stack":100,"path":"UTG_60%","actor":"UTG","match":"bundle","preflopExploitabil… |
| 36 | MCP tools | get_postflop_node [key] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 37 | MCP tools | get_postflop_range [key] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 38 | MCP tools | explain_combo [key] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 39 | MCP tools | get_board_report [key] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 40 | MCP tools | compare_strategies [key] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 41 | MCP tools | get_upload_link [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 42 | MCP tools | find_hands [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 43 | MCP tools | get_hand_results [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 44 | MCP tools | list_my_sessions [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 45 | MCP tools | get_session_summary [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 46 | MCP tools | get_tournament_results [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 47 | MCP tools | list_my_opponents [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 48 | MCP tools | get_opponent_notes [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 49 | MCP tools | get_opponent_limp_range [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 50 | MCP tools | list_queued_solves [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 51 | MCP tools | get_queued_solve [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 52 | MCP tools | list_library_solutions [account] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 53 | MCP tools | enqueue_solve [mutating] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 54 | MCP tools | upload_hand_history [mutating] | PASS | key gate observed (no key in this run); HTTP 200; This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs ar… |
| 55 | Scenarios | BTN open range, 6-max NL 100bb (get_range, no key) | PASS | from the rows: 550.88 combos, 91 hand classes = 85 pure + 6 mixed, AA ["AA",1,19.2] |
| 56 | Scenarios | CO open vs BTN 3-bet, AQo (get_node, no key) | PASS | actor CO: Fold 0, Call 0.5, 95% 0.5, AI 0 |
| 57 | Scenarios | get_range server summary vs rows (BTN open range) | WARN | server summary 91 = 86 pure + 4 mixed; from the rows 91 = 85 pure + 6 mixed; combos server 550.88 vs rows 550.88 (server issue: frequency 0.995 counted as pure (T5s 0.995), 0.005 in neither bucket (Q3s 0.005); examples compute counts from the rows) |
| 58 | Scenarios | get_range minFreq filter (CO 4-bet range, minFreq 0.5) | FAIL | 28 rows returned, 20 at or below 0.5 (lowest 0.005): minFreq is ignored |
| 59 | Scenarios | EV baseline reported in a node after a 3-bet | WARN | compact: fold evSb -5, evBaseline absent; full: evBaseline null (odd: the default compact reply drops evBaseline, so a non-zero fold EV is not flagged) |
| 60 | Paid data | nlmtt8 30bb UTG first-in node (get_node) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 61 | Paid data | plo 100bb UTG first-in node (get_node) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 62 | Paid data | plo9 100bb UTG first-in node (get_node) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 63 | Paid data | postflop CO vs BB 3h 3d 2s root (get_postflop_node) | SKIP | no POKERDATA_API_KEY set; set a pdk_ key to run this check |
| 64 | stdio bridge | local bin/pokerdata-mcp.js (no key) | PASS | server 1.5.0, 29 tools, BTN K9o raise 1 |
| 65 | stdio bridge | npx -y pokerdata-mcp@latest (published npm package, run outside the repo, no key) | PASS | server 1.5.0, 29 tools, BTN K9o raise 1 |
