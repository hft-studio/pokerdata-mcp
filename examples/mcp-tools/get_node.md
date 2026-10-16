# `get_node`

CO facing a BTN 3-bet at 100bb: every action for AQo.

- Group: Preflop
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T02:40:31Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO","hand":"AQo"}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("get_node", {"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO","hand":"AQo"});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "history": "UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO",
  "actor": "CO",
  "continuingCombos": 217.14,
  "hand": "AQo",
  "actions": [
    {
      "action": "Fold",
      "kind": "fold",
      "combos": 161.2,
      "frequency": 0,
      "evSb": -5
    },
    {
      "action": "Call",
      "kind": "call",
      "combos": 149.57,
      "frequency": 0.5,
      "evSb": -2.45
    },
    {
      "action": "95%",
      "kind": "raise",
      "sizePct": 95,
      "combos": 62.35,
      "sizeBb": 23.2,
      "sizePctPot": 95,
      "frequency": 0.5,
      "evSb": -2.45
    },
    {
      "action": "AI",
      "kind": "allin",
      "combos": 5.22,
      "sizeBb": 100,
      "sizePctPot": null,
      "sizeReason": "All-in raise-to is the solved stack depth in bb. It is not a pot-percent size.",
      "frequency": 0,
      "evSb": -8.59
    }
  ]
}
```
