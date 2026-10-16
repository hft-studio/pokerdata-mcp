# `list_spots`

Spots at 100bb whose history contains CO, one decision deep.

- Group: Preflop
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T01:46:00Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_spots","arguments":{"game":"nl","stack":100,"contains":"CO","depth":1,"limit":10}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("list_spots", {"game":"nl","stack":100,"contains":"CO","depth":1,"limit":10});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "game": "nl",
  "stack": 100,
  "total": 9270,
  "matched": 4,
  "offset": 0,
  "returned": 4,
  "nextOffset": null,
  "spots": [
    {
      "history": "UTG_Fold_HJ_Fold_CO",
      "depth": 1
    },
    {
      "history": "UTG_Fold_HJ_Fold_CO_Fold_BTN",
      "depth": 1
    },
    {
      "history": "UTG_Fold_HJ_Fold_CO_Fold_BTN_Fold_SB",
      "depth": 1
    },
    {
      "history": "UTG_Fold_HJ_Fold_CO_Fold_BTN_Fold_SB_Call_BB",
      "depth": 1
    }
  ]
}
```
