# `get_range`

BTN opening range at 100bb when folded to (rows are [hand, frequency, evSb]; limit 500 returns every row).

- Group: Preflop
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T01:58:09Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_range","arguments":{"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%","limit":500}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("get_range", {"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%","limit":500});
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

### Counts computed from the rows

Computed with `rangeStats` from all 91 rows: 91 nonzero hands = 85 pure (frequency 1) + 6 mixed (0 < frequency < 1), 550.88 combos.

The server's `summary` above says 91 = 86 pure + 4 mixed, which does not add up. This is a server issue: hands at frequency 0.995 are counted as pure, and hands at 0.005 are counted in `nonzeroHands` but in neither bucket. Use counts computed from the rows instead.
