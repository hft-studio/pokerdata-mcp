# PokerData MCP: GTO poker solver data for AI agents

[PokerData](https://pokerdata.io) serves GTO solver strategy for no-limit
hold'em and pot-limit Omaha as JSON, over an MCP server and a REST API.
Point Claude, Cursor or any MCP client at it and ask "what does UTG open at
100bb?" or "how does the BB defend vs a BTN open?" and the agent gets the
solver's real frequencies and EVs, not a guess.

- **Endpoint:** `https://pokerdata.io/api/mcp` (Streamable HTTP, stateless)
- **Free without a key:** the tool list and the coverage and docs tools
- **Strategy data:** a `pdk_` key from [pokerdata.io/app/api](https://pokerdata.io/app/api).
  A free Starter key (25 calls or 50 MB a month, no card) unlocks every data
  tool. Claude and other OAuth clients can sign in instead of pasting a key.

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

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=pokerdata&config=eyJ1cmwiOiJodHRwczovL3Bva2VyZGF0YS5pby9hcGkvbWNwIiwiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyICR7ZW52OlBPS0VSREFUQV9BUElfS0VZfSJ9fQ==)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect/mcp/install?name=pokerdata&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22pokerdata_api_key%22%2C%22description%22%3A%22PokerData%20API%20key%20%28pdk_...%29.%20Get%20a%20free%20one%20at%20pokerdata.io%2Fapp%2Fapi.%22%2C%22password%22%3Atrue%7D%5D&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fpokerdata.io%2Fapi%2Fmcp%22%2C%22headers%22%3A%7B%22Authorization%22%3A%22Bearer%20%24%7Binput%3Apokerdata_api_key%7D%22%7D%7D)
[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_Server-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=pokerdata&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22pokerdata_api_key%22%2C%22description%22%3A%22PokerData%20API%20key%20%28pdk_...%29.%20Get%20a%20free%20one%20at%20pokerdata.io%2Fapp%2Fapi.%22%2C%22password%22%3Atrue%7D%5D&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fpokerdata.io%2Fapi%2Fmcp%22%2C%22headers%22%3A%7B%22Authorization%22%3A%22Bearer%20%24%7Binput%3Apokerdata_api_key%7D%22%7D%7D)

The buttons install the hosted server. Strategy tools need a `pdk_` key (the
free Starter key works): VS Code asks for it when it starts the server, and
Cursor reads it from the `POKERDATA_API_KEY` environment variable.

### Claude (claude.ai and Claude Desktop)

Open **Settings → Connectors → Add custom connector**, name it `PokerData` and
paste `https://pokerdata.io/api/mcp` as the URL, then sign in with your
PokerData account when Claude asks. Your plan's allowance applies, the free
Starter allowance included.

### Claude Code

```sh
claude mcp add --transport http pokerdata https://pokerdata.io/api/mcp \
  --header "Authorization: Bearer pdk_YOUR_KEY"
```

### Cursor (`~/.cursor/mcp.json`)

This is the same config the button installs, and the one in
[`.mcp.json`](.mcp.json). Set `POKERDATA_API_KEY` in your environment, or
replace `${env:POKERDATA_API_KEY}` with your key.

```json
{
  "mcpServers": {
    "pokerdata": {
      "url": "https://pokerdata.io/api/mcp",
      "headers": { "Authorization": "Bearer ${env:POKERDATA_API_KEY}" }
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

Without `env`, only the tool list and the coverage and docs tools answer. The bridge in
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
| Coverage and docs | `get_started`, `list_games`, `list_postflop_packs`, `list_datasets`, `get_tree_docs`, `get_exploitability` | Not needed |
| Preflop | `get_range`, `get_node`, `list_spots`, `get_config`, `get_range_metadata` | Needed, 6-max NL included; the free Starter key works |
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
| No key | Free | Tool list, coverage and docs tools |
| Starter | Free key, no card | Every data tool, 25 calls or 50 MB a month. Personal use |
| Hobbyist | $10/month | Every data tool, 10,000 calls or 200 MB a month, 5 requests a second. Personal use |
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
evaluation under the [pokerdata.io terms](https://pokerdata.io/terms); see
[`samples/LICENSE.md`](samples/LICENSE.md).
