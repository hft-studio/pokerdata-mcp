# `get_tournament_results`

Uploaded tournament summaries.

- Group: Your hands
- Access: Needs any key (Starter included); reads that key's account
- Live status: **key gate observed (no key in this run)** (PASS)
- Captured: 2026-10-16T02:40:31Z, without `POKERDATA_API_KEY`, HTTP 200, `isError: true`

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H "Authorization: Bearer $POKERDATA_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_tournament_results","arguments":{"limit":5}}}'
```

Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):

```js
// run from the examples/ folder
import { callTool } from "./lib/pokerdata.mjs";
const res = await callTool("get_tournament_results", {"limit":5});
```

## Live response

Full JSON-RPC reply (not trimmed):

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "This needs an API key. 6-max NL cash preflop (game \"nl\"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included."
      }
    ],
    "isError": true
  }
}
```

No key was available when this page was captured, so the reply above is the server's real key gate, not data.
Run `POKERDATA_API_KEY=pdk_... node examples/mcp-tools/capture.mjs` to regenerate this page with the keyed response.

This tool reads the calling key's own account. `capture.mjs` only captures this page without a key,
so the reply above is never someone's real hands, opponents or solve queue.
