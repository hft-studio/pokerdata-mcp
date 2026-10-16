# `list_datasets`

Preflop datasets with bundle counts per stack.

- Group: Coverage and docs
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T02:40:31Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_datasets","arguments":{}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("list_datasets", {});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "source": "data/tree-docs",
  "generated": "2026-10-13",
  "preflopExploitability": "not available",
  "datasets": [
    {
      "id": "nl/v2",
      "rows": 48,
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
      ],
      "analyzed": 48,
      "formats": [
        "5p-0.5bb"
      ],
      "perNode": false
    },
    {
      "id": "nl9",
      "rows": 18,
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
      ],
      "analyzed": 18,
      "formats": [
        "10p-3bb",
        "sb-ante-5p-3bbcap-GG"
      ],
      "perNode": false
    },
    {
      "id": "nlmtt8",
      "rows": 80,
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
      ],
      "analyzed": 80,
      "formats": [
        "vs50bb",
        "",
        "BB-ANTE"
      ],
      "perNode": false
    },
    {
      "id": "plo",
      "rows": 54,
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
      ],
      "analyzed": 1,
      "formats": [
        "5p-1bb"
      ],
      "perNode": false
    },
    "… 3 more items"
  ],
  "readme": "Call get_tree_docs with a dataset id for the write-up and per-stack counts."
}
```
