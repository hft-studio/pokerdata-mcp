# Shell helper sourced by the example scripts.
#   mcp_call <tool> '<json arguments>' [show.mjs options]
# Sends one tools/call to the hosted server and pretty-prints the result.
# Adds the Authorization header only when POKERDATA_API_KEY is set.

MCP_URL=${POKERDATA_MCP_URL:-https://pokerdata.io/api/mcp}
LIB_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

auth=()
if [ -n "${POKERDATA_API_KEY:-}" ]; then
  auth=(-H "Authorization: Bearer $POKERDATA_API_KEY")
fi

mcp_call() {
  local name=$1 args=$2
  shift 2
  echo "\$ tools/call $name $args"
  curl -s "$MCP_URL" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json, text/event-stream' \
    "${auth[@]}" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"$name\",\"arguments\":$args}}" |
    node "$LIB_DIR/show.mjs" "$@"
  echo
}
