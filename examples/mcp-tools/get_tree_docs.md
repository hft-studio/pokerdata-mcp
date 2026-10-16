# `get_tree_docs`

Tree documentation for one dataset (6-max NL).

- Group: Coverage and docs
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T01:46:00Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_tree_docs","arguments":{"dataset":"nl/v2"}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("get_tree_docs", {"dataset":"nl/v2"});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "dataset": "nl/v2",
  "source": "data/tree-docs/README.md",
  "preflopExploitability": "not available",
  "coverage": "| nl/v2 (6-max cash) | all 48 bundles analyzed: 126,631 edges, 57,448 decision nodes (derived; equals the nl/v2 node-file count) |\nNo preflop exploitability is published. See get_exploitability.",
  "stacks": [
    {
      "stackBb": 20,
      "positions": [
        "BB",
        "BTN",
        "CO",
        "HJ",
        "… 2 more items"
      ],
      "formats": [
        "5p-0.5bb"
      ],
      "rows": 6,
      "analyzed": 6,
      "edges": 1934,
      "decisionNodes": 913,
      "hasRaiseMeta": false,
      "bundles": [
        {
          "position": "BB",
          "key": "ranges/nl/v2/20/BB.json.gz",
          "edges": 296,
          "decisionNodes": 128,
          "analyzed": true,
          "gzBytes": 136510
        },
        {
          "position": "BTN",
          "key": "ranges/nl/v2/20/BTN.json.gz",
          "edges": 365,
          "decisionNodes": 175,
          "analyzed": true,
          "gzBytes": 143016
        },
        {
          "position": "CO",
          "key": "ranges/nl/v2/20/CO.json.gz",
          "edges": 402,
          "decisionNodes": 194,
          "analyzed": true,
          "gzBytes": 150011
        },
        {
          "position": "HJ",
          "key": "ranges/nl/v2/20/HJ.json.gz",
          "edges": 338,
          "decisionNodes": 164,
          "analyzed": true,
          "gzBytes": 123552
        },
        "… 2 more items"
      ]
    },
    {
      "stackBb": 30,
      "positions": [
        "BB",
        "BTN",
        "CO",
        "HJ",
        "… 2 more items"
      ],
      "formats": [
        "5p-0.5bb"
      ],
      "rows": 6,
      "analyzed": 6,
      "edges": 4868,
      "decisionNodes": 2247,
      "hasRaiseMeta": false,
      "bundles": [
        {
          "position": "BB",
          "key": "ranges/nl/v2/30/BB.json.gz",
          "edges": 896,
          "decisionNodes": 415,
          "analyzed": true,
          "gzBytes": 404725
        },
        {
          "position": "BTN",
          "key": "ranges/nl/v2/30/BTN.json.gz",
          "edges": 965,
          "decisionNodes": 441,
          "analyzed": true,
          "gzBytes": 392720
        },
        {
          "position": "CO",
          "key": "ranges/nl/v2/30/CO.json.gz",
          "edges": 808,
          "decisionNodes": 375,
          "analyzed": true,
          "gzBytes": 329706
        },
        {
          "position": "HJ",
          "key": "ranges/nl/v2/30/HJ.json.gz",
          "edges": 773,
          "decisionNodes": 359,
          "analyzed": true,
          "gzBytes": 323945
        },
        "… 2 more items"
      ]
    },
    {
      "stackBb": 40,
      "positions": [
        "BB",
        "BTN",
        "CO",
        "HJ",
        "… 2 more items"
      ],
      "formats": [
        "5p-0.5bb"
      ],
      "rows": 6,
      "analyzed": 6,
      "edges": 6282,
      "decisionNodes": 2884,
      "hasRaiseMeta": false,
      "bundles": [
        {
          "position": "BB",
          "key": "ranges/nl/v2/40/BB.json.gz",
          "edges": 1008,
          "decisionNodes": 461,
          "analyzed": true,
          "gzBytes": 473341
        },
        {
          "position": "BTN",
          "key": "ranges/nl/v2/40/BTN.json.gz",
          "edges": 1213,
          "decisionNodes": 553,
          "analyzed": true,
          "gzBytes": 519169
        },
        {
          "position": "CO",
          "key": "ranges/nl/v2/40/CO.json.gz",
          "edges": 1125,
          "decisionNodes": 512,
          "analyzed": true,
          "gzBytes": 478263
        },
        {
          "position": "HJ",
          "key": "ranges/nl/v2/40/HJ.json.gz",
          "edges": 1009,
          "decisionNodes": 466,
          "analyzed": true,
          "gzBytes": 424809
        },
        "… 2 more items"
      ]
    },
    {
      "stackBb": 50,
      "positions": [
        "BB",
        "BTN",
        "CO",
        "HJ",
        "… 2 more items"
      ],
      "formats": [
        "5p-0.5bb"
      ],
      "rows": 6,
      "analyzed": 6,
      "edges": 6515,
      "decisionNodes": 2994,
      "hasRaiseMeta": false,
      "bundles": [
        {
          "position": "BB",
          "key": "ranges/nl/v2/50/BB.json.gz",
          "edges": 1044,
          "decisionNodes": 482,
          "analyzed": true,
          "gzBytes": 490218
        },
        {
          "position": "BTN",
          "key": "ranges/nl/v2/50/BTN.json.gz",
          "edges": 1276,
          "decisionNodes": 574,
          "analyzed": true,
          "gzBytes": 556887
        },
        {
          "position": "CO",
          "key": "ranges/nl/v2/50/CO.json.gz",
          "edges": 1120,
          "decisionNodes": 511,
          "analyzed": true,
          "gzBytes": 483334
        },
        {
          "position": "HJ",
          "key": "ranges/nl/v2/50/HJ.json.gz",
          "edges": 1048,
          "decisionNodes": 486,
          "analyzed": true,
          "gzBytes": 455392
        },
        "… 2 more items"
      ]
    },
    "… 4 more items"
  ]
}
```
