# Shell helper sourced by the example scripts.
#   mcp_call <tool> '<json arguments>' [show.mjs options]
# Sends one tools/call to the hosted server and pretty-prints the result.
# Adds the Authorization header only when POKERDATA_API_KEY is set.
#
# Keyless calls are limited to 200 per day per IP; HTTP 429 says so explicitly.

MCP_URL=${POKERDATA_MCP_URL:-https://pokerdata.io/api/mcp}
LIB_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
MCP_MAX_TIME=${POKERDATA_MAX_TIME:-30}

auth=()
if [ -n "${POKERDATA_API_KEY:-}" ]; then
  auth=(-H "Authorization: Bearer $POKERDATA_API_KEY")
fi

mcp_call() {
  local name=$1 args=$2
  shift 2
  echo "\$ tools/call $name $args"
  local reply status body
  # bash 3.2 (macOS) expands "${auth[@]}" of an empty array to an unbound
  # variable error under `set -u`, so guard it with ${auth[@]+...}.
  reply=$(curl -s --max-time "$MCP_MAX_TIME" -w '\n%{http_code}' "$MCP_URL" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json, text/event-stream' \
    ${auth[@]+"${auth[@]}"} \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"$name\",\"arguments\":$args}}") || {
    echo "curl failed (timeout is ${MCP_MAX_TIME}s; set POKERDATA_MAX_TIME to change it)"
    echo
    return 0
  }
  status=${reply##*$'\n'}
  body=${reply%$'\n'*}
  if [ "$status" = "429" ]; then
    echo "HTTP 429: rate limited. Keyless access allows 200 calls/day per IP; set POKERDATA_API_KEY or wait for the daily reset."
  elif [ "$status" != "200" ]; then
    echo "HTTP $status (not 200), raw reply:"
  fi
  printf '%s' "$body" | node "$LIB_DIR/show.mjs" "$@"
  echo
}
