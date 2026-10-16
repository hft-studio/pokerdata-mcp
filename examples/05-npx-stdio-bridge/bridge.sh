#!/usr/bin/env bash
# Talk to PokerData through the published stdio bridge, exactly as Claude
# Desktop or any stdio MCP client does: newline-delimited JSON-RPC in, out.
#   bash examples/05-npx-stdio-bridge/bridge.sh
#   POKERDATA_API_KEY=pdk_... bash examples/05-npx-stdio-bridge/bridge.sh
set -euo pipefail
# Inside this repository npx would resolve the local package of the same
# name, so run from a temp directory to exercise the published npm package.
cd "$(mktemp -d)"

printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"bridge-example","version":"1.0"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_Fold_BTN","hand":"K9o"}}}' \
  '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"plo","stack":100,"history":"UTG"}}}' |
  npx -y pokerdata-mcp |
  node -e '
    // Summarise each reply line (one JSON-RPC message per line).
    const rl = require("node:readline").createInterface({ input: process.stdin });
    rl.on("line", (line) => {
      const m = JSON.parse(line);
      const r = m.result || {};
      if (r.serverInfo) console.log(`id ${m.id} initialize -> ${JSON.stringify(r.serverInfo)}`);
      else if (r.tools) console.log(`id ${m.id} tools/list -> ${r.tools.length} tools: ${r.tools.map((t) => t.name).join(", ")}`);
      else if (r.content) console.log(`id ${m.id} tools/call -> ${r.isError ? "isError: " : ""}${r.content[0].text}`);
      else console.log(`id ${m.id} -> ${line}`);
    });'
