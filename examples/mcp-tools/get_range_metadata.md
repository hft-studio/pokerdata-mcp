# `get_range_metadata`

Bundle metadata behind the UTG open at 100bb.

- Group: Preflop
- Access: Free, no key
- Live status: **live data, no key** (PASS)
- Captured: 2026-10-16T01:46:00Z, without `POKERDATA_API_KEY`, HTTP 200

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_range_metadata","arguments":{"game":"nl","stack":100,"path":"UTG_60%"}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("get_range_metadata", {"game":"nl","stack":100,"path":"UTG_60%"});
```

## Live response

Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):

```json
{
  "game": "nl",
  "dataset": "nl/v2",
  "stack": 100,
  "path": "UTG_60%",
  "actor": "UTG",
  "match": "bundle",
  "preflopExploitability": "not available",
  "rows": [
    {
      "position": "UTG",
      "format": "5p-0.5bb",
      "key": "ranges/nl/v2/100/UTG.json.gz",
      "analyzed": true,
      "edges": 2977,
      "decisionNodes": 1400,
      "maxActions": 13,
      "manifestEdgeCount": 2977,
      "gzBytes": 1576954,
      "freqSumChecks": 236600,
      "freqSumOff": 228408,
      "hasRaiseMeta": false
    }
  ],
  "note": "Bundle grouped by acting position. The row describes that position's bundle, not one edge. Stored per-edge weights are not a normalized strategy."
}
```
