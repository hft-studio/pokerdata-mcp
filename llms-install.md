# Installing PokerData MCP (for AI agents)

PokerData is a hosted MCP server. There is nothing to build or run locally.

1. Add the remote server `https://pokerdata.io/api/mcp` (Streamable HTTP).
2. The API key is optional. Without one, the tool list and the 6-max NL cash
   preflop tools work. If the user has a `pdk_` key from
   https://pokerdata.io/app/api, send it as `Authorization: Bearer pdk_…`.
   Never invent a key; if the user has none, install without the header.
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

Leave out `env` when there is no key. Node 18 or later is required.

## Check it works

Call `get_node` with `{"game": "nl", "stack": 100, "history": "UTG"}`. It
returns UTG's opening strategy at 100bb with a frequency and EV per hand.
