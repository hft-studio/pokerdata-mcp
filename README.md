# PokerData MCP: GTO poker solver data for AI agents

[PokerData](https://pokerdata.io) serves GTO solver strategy for no-limit
hold'em and pot-limit Omaha as JSON, over an MCP server and a REST API.
Point Claude, Cursor or any MCP client at it and ask "what does UTG open at
100bb?" or "how does the BB defend vs a BTN open?" and the agent gets the
solver's real frequencies and EVs, not a guess.

- **Endpoint:** `https://pokerdata.io/api/mcp` (Streamable HTTP, stateless)
- **Free without a key:** the tool list and every 6-max NL cash preflop tool,
  all 8 stack depths
- **Everything else:** a `pdk_` key from [pokerdata.io/app/api](https://pokerdata.io/app/api).
  A free trial key (100 calls, no card) unlocks every data tool.

This repository holds setup instructions, a small stdio bridge for clients
that only speak stdio, examples and sample data. The data and the server are
hosted at pokerdata.io.

## What's covered

| Game | Format | Stacks | Data |
|---|---|---|---|
| No-limit hold'em 6-max (`nl`) | Cash, 5% rake, 0.5bb cap | 20, 30, 40, 50, 70, 100, 150, 200bb | Every preflop decision node, frequency and EV per hand class (169) |
| NLHE tournament 8-max (`nlmtt8`) | Chip EV, 1bb BB ante | 10 to 300bb | Preflop |
| NLHE tournament 8-max, classic ante (`nlh8-hydra`) | Chip EV, 0.1bb ante | 10, 20, 30, 60bb | Preflop |
| Pot-limit Omaha 6-max (`plo`) | Cash | 12 to 200bb | Preflop, suit-grouped classes |
| PLO 9-max (`plo9`) | Cash | 60, 100bb | Preflop |
| PLO5 6-max (`plo5`) | Cash, 1.2bb ante | 100bb | Preflop and postflop |
| NLHE heads-up postflop | Single-raised, 3-bet and 4-bet pots | 100bb | Solved flops with turns and rivers, per-combo strategy and EV, two bet-size trees |

`list_games` and `list_postflop_packs` return the live coverage, so an agent
never has to trust this table. Not covered: ICM, PKO, multiway postflop,
tournament postflop. Those requests come back as explicit "unsupported"
rather than a cash-game stand-in.

## Set it up

### Claude Code

```sh
# No key: 6-max NL cash preflop
claude mcp add --transport http pokerdata https://pokerdata.io/api/mcp

# With a key: every game and postflop
claude mcp add --transport http pokerdata https://pokerdata.io/api/mcp \
  --header "Authorization: Bearer pdk_YOUR_KEY"
```

### Cursor (`~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "pokerdata": {
      "url": "https://pokerdata.io/api/mcp",
      "headers": { "Authorization": "Bearer pdk_YOUR_KEY" }
    }
  }
}
```

### Claude Desktop and other stdio clients

```json
{
  "mcpServers": {
    "pokerdata": {
      "command": "npx",
      "args": ["-y", "pokerdata-mcp"],
      "env": { "POKERDATA_API_KEY": "pdk_YOUR_KEY" }
    }
  }
}
```

Leave out `env` to use the free tools only. The bridge in
[`bin/pokerdata-mcp.js`](bin/pokerdata-mcp.js) has no dependencies and only
forwards JSON-RPC to the hosted endpoint. Claude Desktop can also add
`https://pokerdata.io/api/mcp` directly as a custom connector.

### Plain HTTP

```sh
curl -s https://pokerdata.io/api/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"nl","stack":100,"history":"UTG"}}}'
```

More in [`examples/`](examples/): a live example for every MCP tool,
real-world scenarios (NL and PLO ranges, the npm bridge, raw JSON-RPC, Node,
Python, client configs, REST) and a smoke test, all with captured responses.

## Tools

| Group | Tools | Key |
|---|---|---|
| Coverage and docs | `list_games`, `list_postflop_packs`, `list_datasets`, `get_tree_docs`, `get_exploitability` | Not needed |
| Preflop | `get_range`, `get_node`, `list_spots`, `get_config`, `get_range_metadata` | Not needed for `game: "nl"`; needed for every other game |
| Postflop | `get_postflop_node`, `get_postflop_range` | Needed |
| Coaching | `explain_combo`, `get_board_report`, `compare_strategies` | Needed |
| Your hands | hand, session and opponent tools, hand upload | Any key, free trial included; never counts against your allowance |
| Solve queue | `enqueue_solve`, `get_queued_solve`, `list_queued_solves`, `list_library_solutions` | Needed |

Preflop spots are action paths such as `UTG_60%_HJ_Call` (NLHE) or
`UTG_Open_HJ_3B` (PLO). EVs are in small blinds. Responses are compact by
default; pass `detail: "full"` for complete maps. Full contract:
[docs.pokerdata.io/ranges](https://docs.pokerdata.io/ranges).

Every tool's full definition — name, title, description, input schema, output
schema and behaviour annotations — exactly as the server returns it from
`tools/list`, is in [`tools.json`](tools.json). Every tool also returns
`structuredContent` matching its output schema alongside the text result.

## Plans

| Plan | Price | What you get |
|---|---|---|
| No key | Free | Tool list, coverage tools, 6-max NL cash preflop at every stack. 200 tool calls a day per IP |
| Starter | Free key, no card | Every data tool, 100 calls (or 50 MB) lifetime. Personal use |
| Pro | $100/month | Every game and all postflop, 250,000 calls or 5 GB a month. Personal use |
| Enterprise | $250/month | Everything in Pro, **commercial use allowed**, 5 million calls or 100 GB a month, higher rate limit |
| Custom | [Contact us](https://pokerdata.io/support) | Redistribution, bulk export, licences for model training, SLAs |

REST and MCP share one meter. Keys and plans: [pokerdata.io/app/api](https://pokerdata.io/app/api).

## Sample data

[`samples/`](samples/) has two real responses, so you can check the format
before connecting anything:

- `nl-6max-100bb-utg-first-in.json`: UTG's first decision at 100bb, every
  action with per-hand frequency and EV.
- `nl-6max-100bb-utg-open-range.json`: UTG's opening range at 100bb.

## How the solves were made

Preflop cash trees come from established commercial solver packs. The
tournament and postflop solves come from our own engine, validated against an
independent reference solve of the same game tree — the comparison, position
by position, is at
[pokerdata.io/methodology](https://pokerdata.io/methodology).

Nothing is estimated to fill a gap. Postflop exploitability is published per
board (`list_postflop_packs` with a `pack`) and omitted where the solve does
not carry it. No preflop dataset publishes exploitability, convergence or
iteration counts, and `get_exploitability` says so instead of returning a
number.

## Related

- [pokerdata.io](https://pokerdata.io): download the raw solver packs, browse ranges free
- [Poker Study AI](https://www.pokerstudy.ai): an AI coach that reviews your hands against the same solves

Code in this repository is MIT licensed. Sample data is provided for
evaluation under the [pokerdata.io terms](https://pokerdata.io/terms).
