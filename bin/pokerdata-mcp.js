#!/usr/bin/env node
// stdio bridge to the hosted PokerData MCP server.
//
// Reads newline-delimited JSON-RPC from stdin, POSTs each message to
// https://pokerdata.io/api/mcp and writes the reply to stdout. The server
// does all the work; this file only exists for MCP clients that speak stdio.
//
// POKERDATA_API_KEY  optional pdk_ key. Without it, the tool list and the
//                    free 6-max NL cash preflop tools still work.
// POKERDATA_MCP_URL  optional override of the endpoint.

"use strict";

const readline = require("node:readline");

const URL_ = process.env.POKERDATA_MCP_URL || "https://pokerdata.io/api/mcp";
const KEY = (process.env.POKERDATA_API_KEY || "").trim();
const VERSION = require("../package.json").version;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json, text/event-stream",
  "User-Agent": `pokerdata-mcp/${VERSION}`,
};
if (KEY) headers.Authorization = `Bearer ${KEY}`;

function write(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

function errorReply(msg, code, message) {
  if (!msg || msg.id === undefined || msg.id === null) return;
  write({ jsonrpc: "2.0", id: msg.id, error: { code, message } });
}

async function forward(line) {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    write({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
    return;
  }
  let res;
  try {
    res = await fetch(URL_, { method: "POST", headers, body: line });
  } catch (err) {
    errorReply(msg, -32000, `Could not reach ${URL_}: ${err.message}`);
    return;
  }
  if (res.status === 202) return; // notifications get no reply
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    errorReply(msg, -32000, `Unexpected ${res.status} response from ${URL_}`);
    return;
  }
  // Errors raised before the server read the message carry id null; give
  // them back the caller's id so the client can match the reply.
  if (!Array.isArray(body) && body && body.id === null && msg.id !== undefined) {
    body.id = msg.id;
  }
  write(body);
}

const rl = readline.createInterface({ input: process.stdin });
let queue = Promise.resolve();
rl.on("line", (line) => {
  if (!line.trim()) return;
  queue = queue.then(() => forward(line));
});
rl.on("close", () => {
  // Do not call process.exit here: when stdout is a pipe, writes are async
  // and exiting would cut off any reply still buffered (e.g. a tools/list
  // larger than 64 KB). Once the queue settles and stdout drains, the event
  // loop empties and Node exits on its own with this code.
  queue.then(() => {
    process.exitCode = 0;
  });
});
