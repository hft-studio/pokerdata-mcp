#!/usr/bin/env node
// Call every PokerData MCP tool once against the live server and write one
// page per tool (examples/mcp-tools/<tool>.md) with the exact call and the
// real response, plus the coverage table in examples/mcp-tools/README.md and
// examples/README.md.
//
//   node examples/mcp-tools/capture.mjs
//   POKERDATA_API_KEY=pdk_... node examples/mcp-tools/capture.mjs
//
// Without a key, keyed tools are still called and the server's actual reply
// (the key gate) is what gets recorded.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { API_KEY, MCP_URL, callTool, isKeyGate, rpc, trim } from "../lib/pokerdata.mjs";
import { TIER_TEXT, TOOL_CALLS, classify } from "../lib/tool-calls.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const hasKey = Boolean(API_KEY);
const capturedAt = new Date().toISOString().replace(/\.\d+Z$/, "Z");

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
  if (!hasKey && call.tier !== "free") {
    lines.push(
      "",
      "No key was available when this page was captured, so the reply above is the server's real key gate, not data.",
      "Run `POKERDATA_API_KEY=pdk_... node examples/mcp-tools/capture.mjs` to regenerate this page with the keyed response.",
    );
  }
  if (call.tier === "mutating") {
    lines.push(
      "",
      "This tool writes to the account, so the example deliberately sends input that fails the published input schema.",
      "Replace the arguments with real values to use it for real.",
    );
  }
  return lines.join("\n") + "\n";
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
const live = list.body.result.tools.map((t) => t.name).sort();
const ours = TOOL_CALLS.map((c) => c.name).sort();
const missing = live.filter((n) => !ours.includes(n));
const extra = ours.filter((n) => !live.includes(n));
if (missing.length || extra.length) {
  console.error(`tool list drift. Live but no example: ${missing.join(", ") || "none"}. Example but not live: ${extra.join(", ") || "none"}`);
  process.exitCode = 1;
}

const rows = [];
for (const call of TOOL_CALLS) {
  const res = await callTool(call.name, call.args, { key: call.tier === "free" ? "" : API_KEY });
  const verdict = classify(call, res, hasKey, isKeyGate);
  writeFileSync(join(here, `${call.name}.md`), page(call, res, verdict));
  rows.push({ ...call, ...verdict });
  console.log(`${verdict.result.padEnd(4)} ${call.name.padEnd(24)} ${verdict.status}`);
}

const note = `Captured ${capturedAt} ${hasKey ? "with" : "without"} a key. Live \`tools/list\` returned ${live.length} tools; every one has an example below.`;
replaceBlock(join(here, "README.md"), coverageTable(rows, "./"), note);
replaceBlock(join(here, "..", "README.md"), coverageTable(rows, "mcp-tools/"), note);
