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
(`pdk_...`, Starter is a free key with 100 calls, at
[pokerdata.io/app/api](https://pokerdata.io/app/api)) the same scripts return
the paid data. Latest run: [`SMOKE_RESULTS.md`](SMOKE_RESULTS.md).

## Rate limit and call cost

**Keyless access allows 200 calls per day per IP.** Every example below spends
from that budget, and running all of them once is about 150 calls (the smoke
test and a full capture are 90 of those), so a second pass in the same day
hits the cap. When it does, the API answers `HTTP 429`; every script here
reports that explicitly instead of failing with a parse error, and the smoke
test prints the hint once at the end. Wait for the daily reset or set
`POKERDATA_API_KEY`.

Approximate requests per script:

| Script | Calls | Notes |
|---|---|---|
| [`curl.sh`](curl.sh) | 2 | `tools/list`, one `get_node` |
| [`rest.sh`](rest.sh) | 2 | REST discovery plus one keyed range |
| [`python_mcp.py`](python_mcp.py) | 2 | two `get_range` calls |
| [`01-browse-catalog/catalog.sh`](01-browse-catalog) | 5 | all free |
| [`02-btn-open-range/btn-open.sh`](02-btn-open-range) | 4 | all free |
| [`03-co-vs-btn-3bet/co-vs-3bet.sh`](03-co-vs-btn-3bet) | 5 | all free |
| [`04-plo-and-paid-games/paid.sh`](04-plo-and-paid-games) | 7 | 2 free, 5 need a key |
| [`05-npx-stdio-bridge/bridge.sh`](05-npx-stdio-bridge) | 4 | plus one npm download |
| [`06-streamable-http-jsonrpc/session.sh`](06-streamable-http-jsonrpc) | 9 | includes the deliberate error replies |
| [`07-node-agent/agent.mjs`](07-node-agent) | 8 | `list_games` once per question |
| [`08-python-agent/agent.py`](08-python-agent) | 5 | 4 MCP, 1 REST |
| [`09-client-configs`](09-client-configs) | 0 | config only |
| [`10-rest-api/rest.sh`](10-rest-api) | 9 | 7 REST, 2 docs |
| [`mcp-tools/capture.mjs`](mcp-tools/capture.mjs) | ~28 | 27 tools plus `tools/list` |
| [`smoke-test`](smoke-test) | ~60 | ~70 with a key |

Two tools write to the account (`enqueue_solve`, `upload_hand_history`). Both
the smoke test and `capture.mjs` skip them unless you pass
`--include-mutating`, with or without a key; even then the example arguments
fail the published input schema on purpose, so nothing is queued or uploaded.

Requests time out after 30 seconds (`POKERDATA_TIMEOUT_MS` for the Node
helpers, `POKERDATA_TIMEOUT` for Python, `POKERDATA_MAX_TIME` for the shell
scripts).

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
key; `key` needs a `pdk_` key; `account` needs any key, Starter included, and
reads that key's own hands, opponents or solve queue; `mutating` would write to
the account, so it is skipped unless `--include-mutating` is passed and its
example sends schema-invalid input on purpose.

`capture.mjs` never writes an `account` page from a keyed run: that reply is
the key owner's own hands, opponents and solve queue, so those pages are only
captured without a key, where the server returns its key gate (a keyed run
leaves them untouched). A `mutating` page shows the request and says the tool
was not called. Both are marked `SKIP` below.

<!-- coverage:start -->
Captured 2026-10-16T02:40:31Z without a key. Live `tools/list` returned 29 tools; every one has a page below. Not called in this run: `enqueue_solve`, `upload_hand_history` (the Live status column says why).

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
| `enqueue_solve` | Solve queue | mutating | [mcp-tools/enqueue_solve.md](mcp-tools/enqueue_solve.md) | SKIP: mutating tools are skipped unless --include-mutating is passed |
| `upload_hand_history` | Your hands | mutating | [mcp-tools/upload_hand_history.md](mcp-tools/upload_hand_history.md) | SKIP: mutating tools are skipped unless --include-mutating is passed |
<!-- coverage:end -->
