#!/usr/bin/env bash
# Raw MCP over Streamable HTTP with curl: the full handshake a client performs,
# then a tool call, plus the server's replies to common mistakes.
# The server is stateless: no Mcp-Session-Id is needed between calls.
#   bash examples/06-streamable-http-jsonrpc/session.sh
set -euo pipefail
URL=${POKERDATA_MCP_URL:-https://pokerdata.io/api/mcp}
H=(-H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream')
MAX_TIME=${POKERDATA_MAX_TIME:-30}
# Keyless calls are limited to 200 per day per IP; a 429 below means that cap.

post() { # post <label> <json-body>
  echo "--- $1"
  curl -s --max-time "$MAX_TIME" -w '\n[HTTP %{http_code}]\n' "$URL" "${H[@]}" -d "$2" ||
    echo "curl failed (timeout is ${MAX_TIME}s; set POKERDATA_MAX_TIME to change it)"
  echo
}

post "initialize" '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'
post "notifications/initialized (no reply body expected)" '{"jsonrpc":"2.0","method":"notifications/initialized"}'

echo "--- tools/list (names only)"
curl -s --max-time "$MAX_TIME" "$URL" "${H[@]}" -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' |
  node -e '
    // Anything other than a JSON-RPC reply with result.tools (an error page, a
    // 429 body, an empty response) is printed as is instead of crashing.
    let s = "";
    process.stdin.on("data", (d) => (s += d)).on("end", () => {
      let reply;
      try {
        reply = JSON.parse(s);
      } catch {
        console.log(`not JSON (${s.length} bytes): ${s.slice(0, 300) || "<empty reply>"}`);
        return;
      }
      const t = reply?.result?.tools;
      if (!Array.isArray(t)) {
        console.log(`no result.tools in the reply: ${JSON.stringify(reply).slice(0, 300)}`);
        return;
      }
      console.log(`${t.length} tools: ${t.map((x) => x.name).join(", ")}`);
    });'
echo

post "resources/list" '{"jsonrpc":"2.0","id":3,"method":"resources/list"}'
post "tools/call get_node (UTG first-in, AKo)" '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"nl","stack":100,"history":"UTG","hand":"AKo"}}}'
post "tools/call with a missing argument" '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_range","arguments":{"game":"nl","stack":100}}}'
post "tools/call at a stack that is not solved (25bb)" '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"nl","stack":25,"history":"UTG"}}}'
post "malformed JSON" '{bad'

echo "--- GET (browsers, health checks)"
curl -s --max-time "$MAX_TIME" -w '\n[HTTP %{http_code}]\n' "$URL"
