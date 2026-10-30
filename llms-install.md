# Installing PokerData MCP (for AI agents)

PokerData is a hosted MCP server. There is nothing to build or run locally.

1. Add the remote server `https://pokerdata.io/api/mcp` (Streamable HTTP).
2. Strategy tools need a key. Without one, only the tool list and the
   coverage and docs tools answer. If the user has a `pdk_` key from
   https://pokerdata.io/app/api (a free Starter key: 25 calls a month, no
   card), send it as `Authorization: Bearer pdk_…`. OAuth clients such as
   Claude can sign in instead. Never invent a key; if the user has none,
   install without the header and point them to that page.
3. If the client only speaks stdio, use the bridge instead:

```json
{
  "mcpServers": {
    "pokerdata": {
      "command": "npx",
      "args": ["-y", "pokerdata-mcp"],
      "env": { "POKERDATA_API_KEY": "pdk_..." }
    }
  }
}
```

Leave out `env` when there is no key yet. Node 18 or later is required.

## Check it works

Call `get_node` with `{"game": "nl", "stack": 100, "history": "UTG"}`. It
returns UTG's opening strategy at 100bb with a frequency and EV per hand.
