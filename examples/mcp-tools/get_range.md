# `get_range`

BTN opening range at 100bb when folded to (rows are [hand, frequency, evSb]).

- Group: Preflop
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T01:46:00Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_range","arguments":{"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%"}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("get_range", {"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%"});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "spot": "UTG_Fold_HJ_Fold_CO_Fold_BTN_60%",
  "actor": "BTN",
  "combos": 550.88,
  "summary": {
    "nonzeroHands": 91,
    "pureHands": 86,
    "mixedHands": 4,
    "returned": 91,
    "omitted": 0
  },
  "columns": [
    "hand",
    "frequency",
    "evSb"
  ],
  "range": [
    [
      "22",
      1,
      0.11
    ],
    [
      "33",
      1,
      0.2
    ],
    [
      "44",
      1,
      0.34
    ],
    [
      "55",
      1,
      0.5
    ],
    "… 87 more items"
  ]
}
```
