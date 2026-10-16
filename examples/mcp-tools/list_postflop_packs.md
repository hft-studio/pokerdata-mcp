# `list_postflop_packs`

Heads-up postflop packs: preflop line, pot, stacks, sizing trees, solved boards.

- Group: Coverage and docs
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T01:58:09Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_postflop_packs","arguments":{"variant":"nlhe"}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("list_postflop_packs", {"variant":"nlhe"});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "packs": [
    {
      "id": "nlhe-srp-co-vs-bb-100bb",
      "title": "CO opens, BB calls · 100bb",
      "preflopLine": "CO opens, BB calls",
      "stackBb": 100,
      "oopPos": "BB",
      "ipPos": "CO",
      "potBb": 5.5,
      "effStackBb": 97.5,
      "hasEv": true,
      "sizingTrees": [
        {
          "tree": "75",
          "packId": "nlhe-srp-co-vs-bb-100bb",
          "betSizing": "75% pot on every street, plus all-in",
          "boards": 49
        },
        {
          "tree": "33",
          "packId": "nlhe-srp-co-vs-bb-100bb-flop33",
          "betSizing": "33% pot on the flop, then 75% pot on the turn and river, plus all-in",
          "boards": 49
        }
      ],
      "boardCount": 49,
      "queryableBoards": 49,
      "…": "1 more keys"
    },
    {
      "id": "nlhe-3bet-btn-vs-co-100bb",
      "title": "CO opens, BTN raises, CO calls · 100bb",
      "preflopLine": "CO opens, BTN raises, CO calls",
      "stackBb": 100,
      "oopPos": "CO",
      "ipPos": "BTN",
      "potBb": 16.52,
      "effStackBb": 92.49,
      "hasEv": true,
      "sizingTrees": [
        {
          "tree": "75",
          "packId": "nlhe-3bet-btn-vs-co-100bb",
          "betSizing": "75% pot on every street, plus all-in",
          "boards": 49
        },
        {
          "tree": "33",
          "packId": "nlhe-3bet-btn-vs-co-100bb-flop33",
          "betSizing": "33% pot on the flop, then 75% pot on the turn and river, plus all-in",
          "boards": 49
        }
      ],
      "boardCount": 49,
      "queryableBoards": 49,
      "…": "1 more keys"
    },
    {
      "id": "nlhe-3bet-btn-vs-sb-100bb",
      "title": "BTN opens, SB raises, BTN calls · 100bb",
      "preflopLine": "BTN opens, SB raises, BTN calls",
      "stackBb": 100,
      "oopPos": "SB",
      "ipPos": "BTN",
      "potBb": 24,
      "effStackBb": 88.5,
      "hasEv": true,
      "sizingTrees": [
        {
          "tree": "75",
          "packId": "nlhe-3bet-btn-vs-sb-100bb",
          "betSizing": "75% pot on every street, plus all-in",
          "boards": 49
        },
        {
          "tree": "33",
          "packId": "nlhe-3bet-btn-vs-sb-100bb-flop33",
          "betSizing": "33% pot on the flop, then 75% pot on the turn and river, plus all-in",
          "boards": 49
        }
      ],
      "boardCount": 49,
      "queryableBoards": 49,
      "…": "1 more keys"
    },
    {
      "id": "nlhe-3bet-btn-vs-bb-100bb",
      "title": "BTN opens, BB raises, BTN calls · 100bb",
      "preflopLine": "BTN opens, BB raises, BTN calls",
      "stackBb": 100,
      "oopPos": "BB",
      "ipPos": "BTN",
      "potBb": 25.52,
      "effStackBb": 87.49,
      "hasEv": true,
      "sizingTrees": [
        {
          "tree": "75",
          "packId": "nlhe-3bet-btn-vs-bb-100bb",
          "betSizing": "75% pot on every street, plus all-in",
          "boards": 49
        },
        {
          "tree": "33",
          "packId": "nlhe-3bet-btn-vs-bb-100bb-flop33",
          "betSizing": "33% pot on the flop, then 75% pot on the turn and river, plus all-in",
          "boards": 49
        }
      ],
      "boardCount": 49,
      "queryableBoards": 49,
      "…": "1 more keys"
    },
    "… 18 more items"
  ],
  "hint": "Pass \"pack\" for one pack's per-board detail and that tree's exploitability. Use the -flop33 id for the 33% tree."
}
```
