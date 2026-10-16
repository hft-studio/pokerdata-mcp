# Examples

Runnable examples against the live PokerData API: the MCP server at
`https://pokerdata.io/api/mcp` and the REST API at `https://pokerdata.io/api/v1`.
Every response shown in this folder was captured from the live service; long
responses are trimmed and say so. Nothing is mocked.

Requirements: `curl`, Node 18+ (for `npx`, the helpers and the Node example),
Python 3.8+ for the Python example. No packages to install.

```sh
node examples/smoke-test                      # every check, PASS/WARN/FAIL/SKIP per line
POKERDATA_API_KEY=pdk_... node examples/smoke-test
```

Without a key, the free surface returns data and every keyed tool is still
called so its real reply (the key gate) is recorded. With a key
(`pdk_...`, free trial at [pokerdata.io/app/api](https://pokerdata.io/app/api))
the same scripts return the paid data. Latest run:
[`SMOKE_RESULTS.md`](SMOKE_RESULTS.md).

## Scenarios

| Folder | What it shows | Key |
|---|---|---|
| [`01-browse-catalog`](01-browse-catalog) | Games, stacks, datasets, spots and postflop packs before asking for a strategy | No |
| [`02-btn-open-range`](02-btn-open-range) | 6-max NL 100bb: BTN open range and one mixed hand | No |
| [`03-co-vs-btn-3bet`](03-co-vs-btn-3bet) | CO opens, BTN 3-bets: BTN's 3-bet range, CO's response with AQo, CO's 4-bet range | No |
| [`04-plo-and-paid-games`](04-plo-and-paid-games) | PLO, PLO 9-max, NLHE 8-max MTT and postflop | Yes for data |
| [`05-npx-stdio-bridge`](05-npx-stdio-bridge) | A full MCP session through `npx -y pokerdata-mcp` | No |
| [`06-streamable-http-jsonrpc`](06-streamable-http-jsonrpc) | Raw JSON-RPC over HTTP: handshake, tool call, error replies | No |
| [`07-node-agent`](07-node-agent) | Dependency-free Node script answering preflop questions | No (PLO part needs one) |
| [`08-python-agent`](08-python-agent) | Standard-library Python: MCP and REST side by side | No (PLO and REST need one) |
| [`09-client-configs`](09-client-configs) | Claude Desktop, Cursor and Claude Code config | Optional |
| [`10-rest-api`](10-rest-api) | REST endpoints, OpenAPI, `llms.txt`, `ranges.md` with observed status codes | Mostly yes |
| [`mcp-tools`](mcp-tools) | One page per MCP tool: the exact call and the live response | Per tool |

The three short files at the top level ([`curl.sh`](curl.sh),
[`python_mcp.py`](python_mcp.py), [`rest.sh`](rest.sh)) are the original
minimal snippets linked from the main README.

## Helpers

- [`lib/pokerdata.mjs`](lib/pokerdata.mjs): `callTool`, `rpc`, `restGet` and `trim` for Node 18+.
- [`lib/tool-calls.mjs`](lib/tool-calls.mjs): one canonical call per MCP tool, shared by the smoke test and the per-tool pages.
- [`lib/show.mjs`](lib/show.mjs): pipe any reply into it to unwrap, pretty-print and trim it.
- [`lib/mcp.sh`](lib/mcp.sh): `mcp_call <tool> '<json>'` for the shell examples.
- [`mcp-tools/capture.mjs`](mcp-tools/capture.mjs): regenerates the per-tool pages and the table below.

## MCP tool coverage

Every tool from the live `tools/list` (which matches [`../tools.json`](../tools.json))
has a page with a real call and the real reply. Access levels: `free` needs no
key; `key` needs a `pdk_` key; `account` needs any key, free trial included,
and reads that key's own hands, opponents or solve queue; `mutating` would
write to the account, so its example sends schema-invalid input on purpose
and never queues a solve or uploads a hand history.

<!-- coverage:start -->
Captured 2026-10-16T01:46:00Z without a key. Live `tools/list` returned 29 tools; every one has an example below.

| Tool | Group | Access | Example | Live status |
|---|---|---|---|---|
| `list_games` | Coverage and docs | free | [mcp-tools/list_games.md](mcp-tools/list_games.md) | PASS: live data, no key |
| `list_datasets` | Coverage and docs | free | [mcp-tools/list_datasets.md](mcp-tools/list_datasets.md) | PASS: live data, no key |
| `get_tree_docs` | Coverage and docs | free | [mcp-tools/get_tree_docs.md](mcp-tools/get_tree_docs.md) | PASS: live data, no key |
| `get_exploitability` | Coverage and docs | free | [mcp-tools/get_exploitability.md](mcp-tools/get_exploitability.md) | PASS: live data, no key |
| `list_postflop_packs` | Coverage and docs | free | [mcp-tools/list_postflop_packs.md](mcp-tools/list_postflop_packs.md) | PASS: live data, no key |
| `get_config` | Preflop | free | [mcp-tools/get_config.md](mcp-tools/get_config.md) | PASS: live data, no key |
| `list_spots` | Preflop | free | [mcp-tools/list_spots.md](mcp-tools/list_spots.md) | PASS: live data, no key |
| `get_range` | Preflop | free | [mcp-tools/get_range.md](mcp-tools/get_range.md) | PASS: live data, no key |
| `get_node` | Preflop | free | [mcp-tools/get_node.md](mcp-tools/get_node.md) | PASS: live data, no key |
| `get_range_metadata` | Preflop | free | [mcp-tools/get_range_metadata.md](mcp-tools/get_range_metadata.md) | PASS: live data, no key |
| `get_postflop_node` | Postflop | key | [mcp-tools/get_postflop_node.md](mcp-tools/get_postflop_node.md) | PASS: key gate observed (no key in this run) |
| `get_postflop_range` | Postflop | key | [mcp-tools/get_postflop_range.md](mcp-tools/get_postflop_range.md) | PASS: key gate observed (no key in this run) |
| `explain_combo` | Coaching | key | [mcp-tools/explain_combo.md](mcp-tools/explain_combo.md) | PASS: key gate observed (no key in this run) |
| `get_board_report` | Coaching | key | [mcp-tools/get_board_report.md](mcp-tools/get_board_report.md) | PASS: key gate observed (no key in this run) |
| `compare_strategies` | Coaching | key | [mcp-tools/compare_strategies.md](mcp-tools/compare_strategies.md) | PASS: key gate observed (no key in this run) |
| `get_upload_link` | Your hands | account | [mcp-tools/get_upload_link.md](mcp-tools/get_upload_link.md) | PASS: key gate observed (no key in this run) |
| `find_hands` | Your hands | account | [mcp-tools/find_hands.md](mcp-tools/find_hands.md) | PASS: key gate observed (no key in this run) |
| `get_hand_results` | Your hands | account | [mcp-tools/get_hand_results.md](mcp-tools/get_hand_results.md) | PASS: key gate observed (no key in this run) |
| `list_my_sessions` | Your hands | account | [mcp-tools/list_my_sessions.md](mcp-tools/list_my_sessions.md) | PASS: key gate observed (no key in this run) |
| `get_session_summary` | Your hands | account | [mcp-tools/get_session_summary.md](mcp-tools/get_session_summary.md) | PASS: key gate observed (no key in this run) |
| `get_tournament_results` | Your hands | account | [mcp-tools/get_tournament_results.md](mcp-tools/get_tournament_results.md) | PASS: key gate observed (no key in this run) |
| `list_my_opponents` | Your hands | account | [mcp-tools/list_my_opponents.md](mcp-tools/list_my_opponents.md) | PASS: key gate observed (no key in this run) |
| `get_opponent_notes` | Your hands | account | [mcp-tools/get_opponent_notes.md](mcp-tools/get_opponent_notes.md) | PASS: key gate observed (no key in this run) |
| `get_opponent_limp_range` | Your hands | account | [mcp-tools/get_opponent_limp_range.md](mcp-tools/get_opponent_limp_range.md) | PASS: key gate observed (no key in this run) |
| `list_queued_solves` | Solve queue | account | [mcp-tools/list_queued_solves.md](mcp-tools/list_queued_solves.md) | PASS: key gate observed (no key in this run) |
| `get_queued_solve` | Solve queue | account | [mcp-tools/get_queued_solve.md](mcp-tools/get_queued_solve.md) | PASS: key gate observed (no key in this run) |
| `list_library_solutions` | Solve queue | account | [mcp-tools/list_library_solutions.md](mcp-tools/list_library_solutions.md) | PASS: key gate observed (no key in this run) |
| `enqueue_solve` | Solve queue | mutating | [mcp-tools/enqueue_solve.md](mcp-tools/enqueue_solve.md) | PASS: key gate observed (no key in this run) |
| `upload_hand_history` | Your hands | mutating | [mcp-tools/upload_hand_history.md](mcp-tools/upload_hand_history.md) | PASS: key gate observed (no key in this run) |
<!-- coverage:end -->
