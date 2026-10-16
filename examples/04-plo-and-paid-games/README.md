# PLO, PLO 9-max, MTT and postflop

Every game other than 6-max NL cash, and all postflop, needs a `pdk_` key
(a free trial key gives 100 calls). Coverage and docs tools stay free, so an
agent can still see what PLO covers without one.

Run it with a key to get data:

```sh
POKERDATA_API_KEY=pdk_... bash examples/04-plo-and-paid-games/paid.sh
```

## Run it

```sh
bash examples/04-plo-and-paid-games/paid.sh
```

The core call as a single copy-paste command:

```sh
curl -s https://pokerdata.io/api/mcp -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $POKERDATA_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"plo","stack":100,"history":"UTG"}}}'
```

## Live output

Captured 2026-10-16 01:45 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
POKERDATA_API_KEY is not set: the free calls return data, the paid calls show the key gate.

$ tools/call get_tree_docs {"dataset":"plo"}
{
  "dataset": "plo",
  "source": "data/tree-docs/README.md",
  "preflopExploitability": "not available",
  "coverage": "| plo | 1 of 54 bundles analyzed (12bb BB); the other 53 from the manifest only (about 1 GB gz) |\nNo preflop exploitability is published. See get_exploitability.",
  "stacks": [
    {
      "stackBb": 12,
      "positions": ["BB", "BTN", "… 4 more items"],
      "formats": ["5p-1bb"],
      "rows": 6,
      "analyzed": 1,
      "edges": 126,
      "decisionNodes": 60,
      "hasRaiseMeta": false,
      "…": "1 more keys"
    },
    {
      "stackBb": 20,
      "positions": ["BB", "BTN", "… 4 more items"],
      "formats": ["5p-1bb"],
      "rows": 6,
      "analyzed": 0,
      "edges": null,
      "decisionNodes": null,
      "hasRaiseMeta": false,
      "…": "1 more keys"
    },
    "… 7 more items"
  ]
}

$ tools/call get_exploitability {"game":"plo"}
{
  "game": "plo",
  "dataset": "plo",
  "available": false,
  "status": "not available",
  "exploitability": null,
  "iterations": null,
  "convergence": null,
  "reason": "No exploitability, convergence, or iteration data is published for this preflop dataset. No number was estimated."
}

$ tools/call get_node {"game":"plo","stack":100,"history":"UTG"}
isError: true
This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included.

$ tools/call get_config {"game":"plo9","stack":100}
isError: true
This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included.

$ tools/call get_node {"game":"nlmtt8","stack":30,"history":"UTG"}
isError: true
This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included.

$ tools/call get_postflop_node {"pack":"nlhe-srp-co-vs-bb-100bb","board":"3h 3d 2s"}
isError: true
This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included.

$ tools/call explain_combo {"pack":"nlhe-srp-co-vs-bb-100bb","board":"3h 3d 2s","combo":"AsKh"}
isError: true
This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included.
```
