# `enqueue_solve`

Dry call: an empty title and pot 0 both fail the input schema (minLength 1, exclusiveMinimum 0), so the request is meant to be rejected before anything is recorded.

- Group: Solve queue
- Access: Writes to the account; skipped unless `--include-mutating` is passed
- Live status: **mutating tools are skipped unless --include-mutating is passed** (SKIP)
- Not captured: 2026-10-16T02:40:31Z

## Call

```sh
curl -s https://pokerdata.io/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H "Authorization: Bearer $POKERDATA_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"enqueue_solve","arguments":{"title":"","board":"Ks 7d 2c","pot":0,"effective_stack":97.5}}}'
```

## Live response

This run did not call the tool: mutating tools are skipped unless --include-mutating is passed.
Run `node examples/mcp-tools/capture.mjs --include-mutating` to capture it.
