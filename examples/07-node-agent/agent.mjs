#!/usr/bin/env node
// A small "agent" in Node 18+ with no npm dependencies: it answers concrete
// preflop questions the way an LLM tool loop would, by checking coverage,
// finding the spot and reading the solver node.
//
//   node examples/07-node-agent/agent.mjs
//   POKERDATA_API_KEY=pdk_... node examples/07-node-agent/agent.mjs   # adds PLO

import { rangeStats } from "../lib/pokerdata.mjs";

const SERVER_URL = process.env.POKERDATA_MCP_URL || "https://pokerdata.io/api/mcp";
const KEY = (process.env.POKERDATA_API_KEY || "").trim();
const TIMEOUT_MS = Number(process.env.POKERDATA_TIMEOUT_MS || 30000);

let nextId = 1;
async function callTool(name, args) {
  let res;
  try {
    res = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...(KEY ? { Authorization: `Bearer ${KEY}` } : {}),
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method: "tools/call", params: { name, arguments: args } }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const why = err?.name === "TimeoutError" ? `timed out after ${TIMEOUT_MS}ms` : err?.message || String(err);
    throw new Error(`${name}: request to ${SERVER_URL} ${why}`);
  }
  // Errors, rate limits and proxies can answer with HTML or an empty body, so
  // never hand the text straight to JSON.parse.
  const body = await res.text();
  let reply;
  try {
    reply = JSON.parse(body);
  } catch {
    const hint = res.status === 429
      ? " Keyless access allows 200 calls/day per IP; set POKERDATA_API_KEY or wait for the daily reset."
      : "";
    throw new Error(`${name}: HTTP ${res.status}, reply is not JSON: ${body.slice(0, 200) || "<empty>"}${hint}`);
  }
  if (reply.error) throw new Error(`${name}: HTTP ${res.status} ${reply.error.message}`);
  const text = reply.result?.content?.find((c) => c.type === "text")?.text;
  if (typeof text !== "string") throw new Error(`${name}: HTTP ${res.status}, no text content in the reply: ${body.slice(0, 200)}`);
  if (reply.result.isError) throw new Error(`${name}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${name}: tool result is not JSON: ${text.slice(0, 200)}`);
  }
}

const pct = (x) => `${Math.round(x * 1000) / 10}%`;

function describe(node) {
  return node.actions
    .filter((a) => a.frequency > 0)
    .map((a) => `${a.kind === "raise" || a.kind === "allin" ? `${a.kind} to ${a.sizeBb}bb` : a.kind} ${pct(a.frequency)} (EV ${a.evSb}sb)`)
    .join(", ");
}

async function ask(question, game, stack, history, hand) {
  console.log(`Q: ${question}`);
  const games = await callTool("list_games", {});
  const entry = games[game];
  // A game the catalog does not list at all is a different answer from a game
  // listed without this stack, so say which it is.
  if (!entry || !Array.isArray(entry.stacks)) {
    const known = Object.keys(games).filter((g) => !g.startsWith("_")).join(", ");
    console.log(`A: there is no game "${game}" in list_games. Games: ${known}\n`);
    return;
  }
  if (!entry.stacks.includes(stack)) {
    console.log(`A: ${game} is not solved at ${stack}bb. Stacks: ${entry.stacks.join(", ")}\n`);
    return;
  }
  const node = await callTool("get_node", { game, stack, history, hand });
  console.log(`A: ${node.actor} with ${hand} at ${stack}bb: ${describe(node)}.\n`);
}

await ask("6-max NL 100bb, folded to me on the BTN with K9o. Open?", "nl", 100, "UTG_Fold_HJ_Fold_CO_Fold_BTN", "K9o");
await ask("6-max NL 100bb, I open CO, BTN 3-bets, blinds fold. AQo?", "nl", 100, "UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO", "AQo");
await ask("Same spot but 25bb deep?", "nl", 25, "UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO", "AQo");

// The whole BTN opening range, summarised from its rows (limit 500 returns every row).
const range = await callTool("get_range", { game: "nl", stack: 100, spot: "UTG_Fold_HJ_Fold_CO_Fold_BTN_60%", limit: 500 });
const stats = rangeStats(range.range);
const mixed = range.range.filter(([, f]) => f > 0 && f < 1).map(([h, f]) => `${h} ${pct(f)}`);
console.log(`BTN opens ${stats.combos} of 1326 combos (${pct(stats.combos / 1326)}) at 100bb: ${stats.nonzeroHands} hand classes = ${stats.pureHands} pure + ${stats.mixedHands} mixed (${mixed.join(", ")})\n`);

// PLO needs a key; show what the server says either way.
try {
  const plo = await callTool("get_node", { game: "plo", stack: 100, history: "UTG" });
  console.log(`PLO 100bb UTG first-in: ${plo.actions.map((a) => `${a.action} ${a.combos} combos`).join(", ")}`);
} catch (err) {
  console.log(`PLO 100bb UTG first-in: ${err.message}`);
}
