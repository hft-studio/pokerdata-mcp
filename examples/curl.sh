#!/bin/sh
# Call the hosted MCP server directly. No key needed for 6-max NL cash preflop.
URL=https://pokerdata.io/api/mcp

# What tools are there?
curl -s "$URL" -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# UTG's first-in strategy at 100bb, every action, all 169 hands.
curl -s "$URL" -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"nl","stack":100,"history":"UTG"}}}'

# Everything else (PLO, PLO5, 9-max, MTT, postflop) needs a key:
#   -H "Authorization: Bearer $POKERDATA_API_KEY"
