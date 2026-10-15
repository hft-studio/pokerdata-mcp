#!/bin/sh
# The same data over the REST API (key required except discovery).
curl -s https://pokerdata.io/api/v1/ranges/nl/v2          # free: stacks + positions
curl -s "https://pokerdata.io/api/v1/ranges/nl/v2/range?stack=100&spot=UTG_60%25_HJ_Call" \
  -H "Authorization: Bearer $POKERDATA_API_KEY"
