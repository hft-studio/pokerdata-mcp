# `upload_hand_history`

Dry call: empty text fails the input schema (minLength 1), so the request is meant to be rejected before anything is ingested.

- Group: Your hands
- Access: Writes to the account; skipped unless `--include-mutating` is passed
- Live status: **mutating tools are skipped unless --include-mutating is passed** (SKIP)
- Not captured: 2026-10-16T02:40:31Z

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H "Authorization: Bearer $POKERDATA_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"upload_hand_history","arguments":{"filename":"dry-run.txt","text":""}}}'
```

## Live response

This run did not call the tool: mutating tools are skipped unless --include-mutating is passed.
Run `node examples/mcp-tools/capture.mjs --include-mutating` to capture it.
