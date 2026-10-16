#!/bin/sh
# Claude Code: add PokerData as a remote HTTP MCP server.

# No key: 6-max NL cash preflop plus the coverage and docs tools.
claude mcp add --transport http pokerdata https://pokerdata.io/api/mcp

# With a key: every game, postflop, coaching, hand and solve-queue tools.
# claude mcp add --transport http pokerdata https://pokerdata.io/api/mcp \
#   --header "Authorization: Bearer $POKERDATA_API_KEY"

# Or through the stdio bridge:
# claude mcp add pokerdata -e POKERDATA_API_KEY="$POKERDATA_API_KEY" -- npx -y pokerdata-mcp
