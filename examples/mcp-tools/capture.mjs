#!/usr/bin/env node
// Call every PokerData MCP tool once against the live server and write one
// page per tool (examples/mcp-tools/<tool>.md) with the exact call and the
// real response, plus the coverage table in examples/mcp-tools/README.md and
// examples/README.md.
//
//   node examples/mcp-tools/capture.mjs
//   POKERDATA_API_KEY=pdk_... node examples/mcp-tools/capture.mjs
//   node examples/mcp-tools/capture.mjs --include-mutating   # opt in, see below
//
// Without a key, keyed tools are still called and the server's actual reply
// (the key gate) is what gets recorded.
//
// Two tiers are never captured by default:
//   mutating  enqueue_solve and upload_hand_history write to the account, so
//             they are skipped unless --include-mutating is passed, with or
//             without a key.
//   account   with a key set, the reply would be that key's own hands,
//             opponents and solve queue, so the page is left as it is rather
//             than committing someone's account data.
// Skipped tools keep their existing page; the coverage table says SKIP and why.
//
// Keyless runs count against 200 calls/day per IP: one full capture is about
// 30 calls (29 tools plus one tools/list).

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { API_KEY, MCP_URL, RATE_LIMIT_HINT, callTool, isKeyGate, rangeStats, rpc, trim } from "../lib/pokerdata.mjs";
import {
  ACCOUNT_SKIP_NOTE,
  INCLUDE_MUTATING_FLAG,
  MUTATING_SKIP_NOTE,
  TIER_TEXT,
  TOOL_CALLS,
  classify,
} from "../lib/tool-calls.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const hasKey = Boolean(API_KEY);
const includeMutating = process.argv.includes(INCLUDE_MUTATING_FLAG);
const capturedAt = new Date().toISOString().replace(/\.\d+Z$/, "Z");

// Why this tool is not being called in this run, or null to call it.
// `keepPage` means an earlier keyless capture of this page is the canonical
// one and must not be overwritten by a stub.
function skipReason(call) {
  if (call.tier === "mutating" && !includeMutating) return { reason: MUTATING_SKIP_NOTE, keepPage: false };
  if (call.tier === "account" && hasKey) return { reason: ACCOUNT_SKIP_NOTE, keepPage: true };
  return null;
}

function curlFor(call) {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: call.name, arguments: call.args } });
  const auth = call.tier === "free" ? "" : `  -H "Authorization: Bearer $POKERDATA_API_KEY" \\\n`;
  return `curl -s ${MCP_URL} \\\n  -H 'Content-Type: application/json' \\\n  -H 'Accept: application/json, text/event-stream' \\\n${auth}  -d '${body}'`;
}

function page(call, res, verdict) {
  const shown = typeof res.data === "string"
    ? JSON.stringify(res.raw, null, 2)
    : JSON.stringify(trim(res.data), null, 2);
  const shownLabel = typeof res.data === "string"
    ? "Full JSON-RPC reply (not trimmed):"
    : "Tool result (`result.content[0].text`, parsed and trimmed: arrays keep 4 items, objects 12 keys, strings 300 chars):";
  const lines = [
    `# \`${call.name}\``,
    "",
    `${call.what}`,
    "",
    `- Group: ${call.group}`,
    `- Access: ${TIER_TEXT[call.tier]}`,
    `- Live status: **${verdict.status}** (${verdict.result})`,
    `- Captured: ${capturedAt}, ${hasKey ? "with" : "without"} \`POKERDATA_API_KEY\`, HTTP ${res.status}${res.isError ? ", `isError: true`" : ""}`,
    "",
    "## Call",
    "",
    "```sh",
    curlFor(call),
    "```",
    "",
    "Same call from Node with the zero-dependency helper in [`../lib/pokerdata.mjs`](../lib/pokerdata.mjs):",
    "",
    "```js",
    `// run from the examples/ folder`,
    `import { callTool } from "./lib/pokerdata.mjs";`,
    `const res = await callTool(${JSON.stringify(call.name)}, ${JSON.stringify(call.args)});`,
    "```",
    "",
    "## Live response",
    "",
    shownLabel,
    "",
    "```json",
    shown,
    "```",
  ];
  if (Array.isArray(res.data?.range) && res.data.columns?.[1] === "frequency") {
    const s = rangeStats(res.data.range);
    const srv = res.data.summary || {};
    lines.push(
      "",
      "### Counts computed from the rows",
      "",
      `Computed with \`rangeStats\` from all ${res.data.range.length} rows: ${s.nonzeroHands} nonzero hands = ${s.pureHands} pure (frequency 1) + ${s.mixedHands} mixed (0 < frequency < 1)${s.combos === null ? "" : `, ${s.combos} combos`}.`,
    );
    if (srv.pureHands !== s.pureHands || srv.mixedHands !== s.mixedHands) {
      lines.push(
        "",
        `The server's \`summary\` above says ${srv.nonzeroHands} = ${srv.pureHands} pure + ${srv.mixedHands} mixed, which does not add up. This is a server issue: hands at frequency 0.995 are counted as pure, and hands at 0.005 are counted in \`nonzeroHands\` but in neither bucket. Use counts computed from the rows instead.`,
      );
    }
  }
  if (!hasKey && call.tier !== "free") {
    lines.push(
      "",
      "No key was available when this page was captured, so the reply above is the server's real key gate, not data.",
      "Run `POKERDATA_API_KEY=pdk_... node examples/mcp-tools/capture.mjs` to regenerate this page with the keyed response.",
    );
  }
  if (call.tier === "account") {
    lines.push(
      "",
      "This tool reads the calling key's own account. `capture.mjs` only captures this page without a key,",
      "so the reply above is never someone's real hands, opponents or solve queue.",
    );
  }
  if (call.tier === "mutating") {
    lines.push(
      "",
      `This tool writes to the account, so \`capture.mjs\` and the smoke test skip it unless \`${INCLUDE_MUTATING_FLAG}\` is passed.`,
      "Even then the example deliberately sends input that fails the published input schema.",
      "Replace the arguments with real values to use it for real.",
    );
  }
  return lines.join("\n") + "\n";
}

// Page for a tool this run did not call: the request, and why there is no reply.
function skippedPage(call, reason) {
  return [
    `# \`${call.name}\``,
    "",
    `${call.what}`,
    "",
    `- Group: ${call.group}`,
    `- Access: ${TIER_TEXT[call.tier]}`,
    `- Live status: **${reason}** (SKIP)`,
    `- Not captured: ${capturedAt}`,
    "",
    "## Call",
    "",
    "```sh",
    curlFor(call),
    "```",
    "",
    "## Live response",
    "",
    `This run did not call the tool: ${reason}.`,
    call.tier === "mutating"
      ? `Run \`node examples/mcp-tools/capture.mjs ${INCLUDE_MUTATING_FLAG}\` to capture it.`
      : "Run `node examples/mcp-tools/capture.mjs` without a key to capture the server's key gate here.",
    "",
  ].join("\n");
}

function coverageTable(rows, linkPrefix) {
  const out = [
    "| Tool | Group | Access | Example | Live status |",
    "|---|---|---|---|---|",
  ];
  for (const r of rows) {
    out.push(`| \`${r.name}\` | ${r.group} | ${r.tier} | [${linkPrefix}${r.name}.md](${linkPrefix}${r.name}.md) | ${r.result}: ${r.status} |`);
  }
  return out.join("\n");
}

function replaceBlock(file, table, note) {
  const text = readFileSync(file, "utf8");
  const start = "<!-- coverage:start -->";
  const end = "<!-- coverage:end -->";
  const i = text.indexOf(start);
  const j = text.indexOf(end);
  if (i < 0 || j < 0) throw new Error(`coverage markers missing in ${file}`);
  writeFileSync(file, text.slice(0, i + start.length) + `\n${note}\n\n${table}\n` + text.slice(j));
}

const list = await rpc("tools/list", undefined, { key: "" });
const liveTools = list.body?.result?.tools;
if (!Array.isArray(liveTools)) {
  const why = list.status === 429
    ? RATE_LIMIT_HINT
    : list.body
      ? `JSON-RPC reply without result.tools: ${JSON.stringify(list.body).slice(0, 300)}`
      : `non-JSON reply: ${list.text.slice(0, 300)}`;
  console.error(`tools/list failed at ${MCP_URL} (HTTP ${list.status}). ${why}`);
  console.error("Nothing was written. Check the endpoint, the network and POKERDATA_API_KEY, then run again.");
  process.exit(1);
}
const live = liveTools.map((t) => t.name).sort();
const ours = TOOL_CALLS.map((c) => c.name).sort();
const missing = live.filter((n) => !ours.includes(n));
const extra = ours.filter((n) => !live.includes(n));
if (missing.length || extra.length) {
  console.error(`tool list drift. Live but no example: ${missing.join(", ") || "none"}. Example but not live: ${extra.join(", ") || "none"}`);
  process.exitCode = 1;
}

const rows = [];
let rateLimited = false;
for (const call of TOOL_CALLS) {
  const file = join(here, `${call.name}.md`);
  const skip = skipReason(call);
  if (skip) {
    // An account page captured without a key stays as it is; a mutating page
    // becomes a stub so the page and the table agree on what ran.
    if (!skip.keepPage || !existsSync(file)) writeFileSync(file, skippedPage(call, skip.reason));
    const verdict = { result: "SKIP", status: skip.reason };
    rows.push({ ...call, ...verdict });
    console.log(`SKIP ${call.name.padEnd(24)} ${skip.reason}`);
    continue;
  }
  const res = await callTool(call.name, call.args, { key: call.tier === "free" ? "" : API_KEY });
  if (res.status === 429) rateLimited = true;
  const verdict = classify(call, res, hasKey, isKeyGate);
  writeFileSync(file, page(call, res, verdict));
  rows.push({ ...call, ...verdict });
  console.log(`${verdict.result.padEnd(4)} ${call.name.padEnd(24)} ${verdict.status}`);
}
if (rateLimited) {
  console.error(`\n${RATE_LIMIT_HINT}`);
  process.exitCode = 1;
}

const skipped = rows.filter((r) => r.result === "SKIP").map((r) => r.name);
const note = [
  `Captured ${capturedAt} ${hasKey ? "with" : "without"} a key.`,
  `Live \`tools/list\` returned ${live.length} tools; every one has a page below.`,
  skipped.length ? `Not called in this run: ${skipped.map((n) => `\`${n}\``).join(", ")} (the Live status column says why).` : "",
].filter(Boolean).join(" ");
replaceBlock(join(here, "README.md"), coverageTable(rows, "./"), note);
replaceBlock(join(here, "..", "README.md"), coverageTable(rows, "mcp-tools/"), note);
