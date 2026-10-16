# `list_games`

Every game with its stack depths and positions, plus what is explicitly unsupported.

- Group: Coverage and docs
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T01:58:09Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_games","arguments":{}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("list_games", {});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "_coverage": {
    "format": [
      "cash",
      "mtt_chip_ev"
    ],
    "supportedObjectives": [
      "cash_game_ev",
      "solver_ev",
      "chip_ev"
    ],
    "supportedTournament": {
      "game": "nlmtt8",
      "format": "mtt",
      "objective": "chip_ev",
      "tableSize": 8,
      "anteBb": 1
    },
    "unsupported": [
      "ICM",
      "PKO",
      "satellites",
      "asymmetric tournament stacks",
      "… 3 more items"
    ]
  },
  "nl": {
    "stacks": [
      20,
      30,
      40,
      50,
      "… 4 more items"
    ],
    "positions": [
      "BB",
      "BTN",
      "CO",
      "HJ",
      "… 2 more items"
    ]
  },
  "nl9": {
    "stacks": [
      100,
      200
    ],
    "positions": [
      "BB",
      "BTN",
      "CO",
      "HJ",
      "… 5 more items"
    ]
  },
  "nlmtt8": {
    "stacks": [
      10,
      15,
      20,
      30,
      "… 6 more items"
    ],
    "positions": [
      "BB",
      "BTN",
      "CO",
      "HJ",
      "… 4 more items"
    ]
  },
  "nlh8-hydra": {
    "stacks": [
      10,
      20,
      30,
      60
    ],
    "positions": [
      "BB",
      "BTN",
      "CO",
      "HJ",
      "… 4 more items"
    ]
  },
  "plo": {
    "stacks": [
      12,
      20,
      30,
      40,
      "… 5 more items"
    ],
    "positions": [
      "BB",
      "BTN",
      "CO",
      "HJ",
      "… 2 more items"
    ]
  },
  "plo5": {
    "stacks": [
      100
    ],
    "positions": [
      "LJ",
      "HJ",
      "CO",
      "BTN",
      "… 2 more items"
    ]
  },
  "plo9": {
    "stacks": [
      60,
      100
    ],
    "positions": [
      "BB",
      "BTN",
      "CO",
      "HJ",
      "… 5 more items"
    ]
  },
  "plo6hu": {
    "stacks": [
      100
    ],
    "positions": [
      "BTN",
      "BB"
    ]
  }
}
```
