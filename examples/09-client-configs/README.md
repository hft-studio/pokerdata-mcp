# Claude Desktop, Cursor and Claude Code config

Drop-in configs. Each comes in a keyed version and a no-key version (the tool
list and the coverage and docs tools only; strategy tools need a key, and the
free Starter key works).

| Client | File | Transport |
|---|---|---|
| Claude Desktop | [`claude_desktop_config.json`](claude_desktop_config.json), [`claude_desktop_config.free.json`](claude_desktop_config.free.json) | stdio, `npx -y pokerdata-mcp` |
| Cursor (`~/.cursor/mcp.json` or `.cursor/mcp.json`) | [`cursor-mcp.json`](cursor-mcp.json), [`cursor-mcp.free.json`](cursor-mcp.free.json) | Streamable HTTP, `https://pokerdata.io/api/mcp` |
| Claude Code | [`claude-code.sh`](claude-code.sh) | Streamable HTTP or stdio |

## Claude Desktop

Merge into `claude_desktop_config.json` (macOS:
`~/Library/Application Support/Claude/`, Windows: `%APPDATA%\Claude\`), then
restart Claude Desktop.

```json
{
  "mcpServers": {
    "pokerdata": {
      "command": "npx",
      "args": ["-y", "pokerdata-mcp"],
      "env": { "POKERDATA_API_KEY": "pdk_YOUR_KEY" }
    }
  }
}
```

Leave out `env` for the free tools. Claude Desktop can also add
`https://pokerdata.io/api/mcp` directly as a custom connector.

## Cursor

```json
{
  "mcpServers": {
    "pokerdata": {
      "url": "https://pokerdata.io/api/mcp",
      "headers": { "Authorization": "Bearer pdk_YOUR_KEY" }
    }
  }
}
```

## Claude Code

```sh
claude mcp add --transport http pokerdata https://pokerdata.io/api/mcp
claude mcp add --transport http pokerdata https://pokerdata.io/api/mcp \
  --header "Authorization: Bearer $POKERDATA_API_KEY"
```

## What was verified live

These configs launch exactly what the other examples exercise:

- The Claude Desktop config runs `npx -y pokerdata-mcp`. The same command is
  driven end to end in [`../05-npx-stdio-bridge`](../05-npx-stdio-bridge)
  (initialize, `tools/list` with 29 tools, and tool calls) and in the smoke
  test's "stdio bridge" checks.
- The Cursor and Claude Code configs point at `https://pokerdata.io/api/mcp`,
  driven with raw JSON-RPC in
  [`../06-streamable-http-jsonrpc`](../06-streamable-http-jsonrpc).

The Claude Desktop, Cursor and Claude Code apps themselves were not run as
part of these examples; the `claude mcp add` commands were not executed here.

What an agent sees after connecting, from the live `initialize` reply
(`serverInfo` and the start of `instructions`):

```json
{"name":"pokerdata-ranges","version":"1.5.0"}
```

```text
For exact postflop hand questions prefer explain_combo. For PLO5 (plo5-) postflop packs use get_postflop_node; the high-level postflop tools are hold'em only. For cross-stack, cross-board, or cross-line questions prefer compare_strategies. For texture heuristics use get_board_report. …
```
