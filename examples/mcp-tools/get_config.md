# `get_config`

Table config for 6-max NL at 100bb: seats, blinds, EV unit.

- Group: Preflop
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T02:40:31Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_config","arguments":{"game":"nl","stack":100}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("get_config", {"game":"nl","stack":100});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "schemaVersion": 1,
  "units": {
    "stack": "bb",
    "stacks": "bb",
    "blinds": "bb",
    "ante": "bb",
    "sizeBb": "bb",
    "openSizes": "bb",
    "evs": "sb"
  },
  "game": "nl",
  "stack": 100,
  "seats": [
    "UTG",
    "HJ",
    "CO",
    "BTN",
    "… 2 more items"
  ],
  "stacks": [
    100,
    100,
    100,
    100,
    "… 2 more items"
  ],
  "blinds": {
    "sb": 0.5,
    "bb": 1
  },
  "ante": null,
  "antePostedBy": null,
  "stackIncludesAnte": null,
  "treeSizes": null,
  "openSizes": null,
  "…": "5 more keys"
}
```
