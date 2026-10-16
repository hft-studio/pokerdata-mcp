#!/usr/bin/env bash
# The REST API at https://pokerdata.io/api/v1 and the plain-text docs.
# Prints the HTTP status and a trimmed body for each call.
#   bash examples/10-rest-api/rest.sh
#   POKERDATA_API_KEY=pdk_... bash examples/10-rest-api/rest.sh
set -euo pipefail
BASE=${POKERDATA_REST_URL:-https://pokerdata.io/api/v1}
SHOW=(node "$(dirname "$0")/../lib/show.mjs")
MAX_TIME=${POKERDATA_MAX_TIME:-30}
auth=()
if [ -n "${POKERDATA_API_KEY:-}" ]; then auth=(-H "Authorization: Bearer $POKERDATA_API_KEY"); fi

get() { # get <url> [show.mjs options]
  local url=$1
  shift
  local body status
  # bash 3.2 (macOS) treats "${auth[@]}" of an empty array as unbound under
  # `set -u`, hence ${auth[@]+...}.
  body=$(curl -s --max-time "$MAX_TIME" ${auth[@]+"${auth[@]}"} -w '\n%{http_code}' "$url") || {
    echo "\$ GET $url  ->  curl failed (timeout is ${MAX_TIME}s; set POKERDATA_MAX_TIME to change it)"
    echo
    return 0
  }
  status=${body##*$'\n'}
  echo "\$ GET $url  ->  HTTP $status"
  if [ "$status" = "429" ]; then
    echo "Rate limited. Keyless access allows 200 calls/day per IP; set POKERDATA_API_KEY or wait for the daily reset."
  fi
  printf '%s' "${body%$'\n'*}" | "${SHOW[@]}" "$@"
  echo
}

# OpenAPI spec (public).
get "$BASE/ranges/openapi.json" --array 3 --keys 4

# Discovery for 6-max NL (public): stacks, positions, endpoint templates.
get "$BASE/ranges/nl/v2" --array 8

# Games, config, a range and a node.
get "$BASE/ranges/games" --array 4
get "$BASE/ranges/nl/config?stack=100" --array 6
get "$BASE/ranges/nl/range?stack=100&spot=UTG_Fold_HJ_Fold_CO_Fold_BTN_60%25" --keys 8
get "$BASE/ranges/nl/node?stack=100&history=UTG_Fold_HJ_Fold_CO_60%25_BTN&hand=AQo" --array 4

# Paid game over REST.
get "$BASE/ranges/plo/config?stack=100" --array 6

# Docs for agents and humans.
get "https://pokerdata.io/llms.txt" --lines 12
get "https://pokerdata.io/ranges.md" --lines 16
