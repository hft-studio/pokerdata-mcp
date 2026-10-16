# Every MCP tool, called live

One page per tool the hosted server exposes at `https://pokerdata.io/api/mcp`.
Each page has the exact `tools/call` request (as `curl` and as Node) and the
real response the server returned when the page was captured. Nothing is
mocked: the pages are written by [`capture.mjs`](capture.mjs), which calls
every tool and checks the live `tools/list` against
[`../lib/tool-calls.mjs`](../lib/tool-calls.mjs) so a new tool can't go
without an example.

```sh
node examples/mcp-tools/capture.mjs                          # free tools return data, keyed tools show the key gate
POKERDATA_API_KEY=pdk_... node examples/mcp-tools/capture.mjs # keyed tools return data
```

Two tools write to the account (`enqueue_solve`, `upload_hand_history`). Their
examples send input that fails the published input schema, so running them
never queues a solve or uploads a hand history.

## Coverage

<!-- coverage:start -->
Captured 2026-10-16T01:58:09Z without a key. Live `tools/list` returned 29 tools; every one has an example below.

| Tool | Group | Access | Example | Live status |
|---|---|---|---|---|
| `list_games` | Coverage and docs | free | [./list_games.md](./list_games.md) | PASS: live data, no key |
| `list_datasets` | Coverage and docs | free | [./list_datasets.md](./list_datasets.md) | PASS: live data, no key |
| `get_tree_docs` | Coverage and docs | free | [./get_tree_docs.md](./get_tree_docs.md) | PASS: live data, no key |
| `get_exploitability` | Coverage and docs | free | [./get_exploitability.md](./get_exploitability.md) | PASS: live data, no key |
| `list_postflop_packs` | Coverage and docs | free | [./list_postflop_packs.md](./list_postflop_packs.md) | PASS: live data, no key |
| `get_config` | Preflop | free | [./get_config.md](./get_config.md) | PASS: live data, no key |
| `list_spots` | Preflop | free | [./list_spots.md](./list_spots.md) | PASS: live data, no key |
| `get_range` | Preflop | free | [./get_range.md](./get_range.md) | PASS: live data, no key |
| `get_node` | Preflop | free | [./get_node.md](./get_node.md) | PASS: live data, no key |
| `get_range_metadata` | Preflop | free | [./get_range_metadata.md](./get_range_metadata.md) | PASS: live data, no key |
| `get_postflop_node` | Postflop | key | [./get_postflop_node.md](./get_postflop_node.md) | PASS: key gate observed (no key in this run) |
| `get_postflop_range` | Postflop | key | [./get_postflop_range.md](./get_postflop_range.md) | PASS: key gate observed (no key in this run) |
| `explain_combo` | Coaching | key | [./explain_combo.md](./explain_combo.md) | PASS: key gate observed (no key in this run) |
| `get_board_report` | Coaching | key | [./get_board_report.md](./get_board_report.md) | PASS: key gate observed (no key in this run) |
| `compare_strategies` | Coaching | key | [./compare_strategies.md](./compare_strategies.md) | PASS: key gate observed (no key in this run) |
| `get_upload_link` | Your hands | account | [./get_upload_link.md](./get_upload_link.md) | PASS: key gate observed (no key in this run) |
| `find_hands` | Your hands | account | [./find_hands.md](./find_hands.md) | PASS: key gate observed (no key in this run) |
| `get_hand_results` | Your hands | account | [./get_hand_results.md](./get_hand_results.md) | PASS: key gate observed (no key in this run) |
| `list_my_sessions` | Your hands | account | [./list_my_sessions.md](./list_my_sessions.md) | PASS: key gate observed (no key in this run) |
| `get_session_summary` | Your hands | account | [./get_session_summary.md](./get_session_summary.md) | PASS: key gate observed (no key in this run) |
| `get_tournament_results` | Your hands | account | [./get_tournament_results.md](./get_tournament_results.md) | PASS: key gate observed (no key in this run) |
| `list_my_opponents` | Your hands | account | [./list_my_opponents.md](./list_my_opponents.md) | PASS: key gate observed (no key in this run) |
| `get_opponent_notes` | Your hands | account | [./get_opponent_notes.md](./get_opponent_notes.md) | PASS: key gate observed (no key in this run) |
| `get_opponent_limp_range` | Your hands | account | [./get_opponent_limp_range.md](./get_opponent_limp_range.md) | PASS: key gate observed (no key in this run) |
| `list_queued_solves` | Solve queue | account | [./list_queued_solves.md](./list_queued_solves.md) | PASS: key gate observed (no key in this run) |
| `get_queued_solve` | Solve queue | account | [./get_queued_solve.md](./get_queued_solve.md) | PASS: key gate observed (no key in this run) |
| `list_library_solutions` | Solve queue | account | [./list_library_solutions.md](./list_library_solutions.md) | PASS: key gate observed (no key in this run) |
| `enqueue_solve` | Solve queue | mutating | [./enqueue_solve.md](./enqueue_solve.md) | PASS: key gate observed (no key in this run) |
| `upload_hand_history` | Your hands | mutating | [./upload_hand_history.md](./upload_hand_history.md) | PASS: key gate observed (no key in this run) |
<!-- coverage:end -->
