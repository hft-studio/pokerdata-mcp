#!/usr/bin/env node
// Pretty-print a PokerData reply piped on stdin, trimmed for reading.
//
//   curl -s ... | node examples/lib/show.mjs [--array N] [--keys N] [--lines N]
//
// JSON-RPC tool results are unwrapped (result.content[0].text is parsed);
// other JSON is printed as is; text (llms.txt, ranges.md) keeps its first lines.
// Trimmed spots say how much was cut. A get_range reply is followed by counts
// computed from all of its rows (rangeStats), since the server's `summary`
// buckets do not add up.

import { rangeStats, trim } from "./pokerdata.mjs";

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? Number(args[i + 1]) : dflt;
};
const maxArray = opt("--array", 6);
const maxKeys = opt("--keys", 14);
const maxLines = opt("--lines", 15);

// JSON.stringify with arrays of primitives kept on one line, so range rows
// read as ["AA", 1, 19.2].
function pretty(value, indent = "") {
  const next = indent + "  ";
  if (Array.isArray(value)) {
    if (value.every((v) => v === null || typeof v !== "object")) return JSON.stringify(value).replace(/,/g, ", ");
    return `[\n${value.map((v) => next + pretty(v, next)).join(",\n")}\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (!entries.length) return "{}";
    return `{\n${entries.map(([k, v]) => `${next}${JSON.stringify(k)}: ${pretty(v, next)}`).join(",\n")}\n${indent}}`;
  }
  return JSON.stringify(value);
}

let input = "";
for await (const chunk of process.stdin) input += chunk;

let json;
try {
  json = JSON.parse(input);
} catch {
  const lines = input.split("\n");
  console.log(lines.slice(0, maxLines).join("\n"));
  if (lines.length > maxLines) console.log(`… ${lines.length - maxLines} more lines`);
  process.exit(0);
}

const result = json?.result;
if (result?.content) {
  const text = result.content.find((c) => c.type === "text")?.text ?? "";
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (result.isError) console.log("isError: true");
  console.log(typeof data === "string" ? data : pretty(trim(data, { maxArray, maxKeys })));
  if (Array.isArray(data?.range) && data.columns?.[1] === "frequency") printRangeStats(data);
} else {
  console.log(pretty(trim(json, { maxArray, maxKeys })));
}

function printRangeStats(data) {
  const s = rangeStats(data.range);
  const server = data.summary || {};
  let line = `Computed from all ${data.range.length} rows: ${s.nonzeroHands} nonzero hands = ${s.pureHands} pure + ${s.mixedHands} mixed`;
  if (s.combos !== null) line += `, ${s.combos} combos`;
  if (server.omitted > 0) line += ` (incomplete: ${server.omitted} rows omitted, raise "limit")`;
  console.log(line);
  if (server.pureHands !== s.pureHands || server.mixedHands !== s.mixedHands) {
    console.log(`Server summary says ${server.nonzeroHands} = ${server.pureHands} pure + ${server.mixedHands} mixed (server issue: frequency 0.995 counted as pure, 0.005 in neither bucket)`);
  }
}
