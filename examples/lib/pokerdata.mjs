// Minimal zero-dependency client for the hosted PokerData MCP server and REST API.
// Node 18+ (global fetch). Used by the smoke test, the per-tool capture script
// and the Node agent example.

export const MCP_URL = process.env.POKERDATA_MCP_URL || "https://pokerdata.io/api/mcp";
export const REST_BASE = process.env.POKERDATA_REST_URL || "https://pokerdata.io/api/v1";
export const API_KEY = (process.env.POKERDATA_API_KEY || "").trim();

// The server's reply to any keyed tool called without a key starts with this.
export const KEY_GATE_PREFIX = "This needs an API key.";

function authHeaders(key) {
  return key ? { Authorization: `Bearer ${key}` } : {};
}

// POST one JSON-RPC message. Returns { status, body, text } where body is the
// parsed JSON-RPC reply (or null for 202 / non-JSON).
export async function rpc(method, params, { key = API_KEY, id = 1, notification = false } = {}) {
  const msg = notification ? { jsonrpc: "2.0", method } : { jsonrpc: "2.0", id, method };
  if (params !== undefined) msg.params = params;
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...authHeaders(key),
    },
    body: JSON.stringify(msg),
  });
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {}
  return { status: res.status, body, text };
}

// Call one MCP tool. Returns { status, isError, data, raw, rpcError }.
// `data` is the tool's text content parsed as JSON when possible, else the string.
export async function callTool(name, args = {}, opts = {}) {
  const r = await rpc("tools/call", { name, arguments: args }, opts);
  const out = { status: r.status, isError: false, data: null, raw: r.body ?? r.text, rpcError: null };
  if (r.body?.error) {
    out.isError = true;
    out.rpcError = r.body.error;
    return out;
  }
  const result = r.body?.result;
  out.isError = Boolean(result?.isError);
  const text = result?.content?.find((c) => c.type === "text")?.text ?? "";
  try {
    out.data = JSON.parse(text);
  } catch {
    out.data = text;
  }
  return out;
}

export function isKeyGate(res) {
  return res.isError && typeof res.data === "string" && res.data.startsWith(KEY_GATE_PREFIX);
}

// GET a REST path (relative to REST_BASE) or an absolute URL.
export async function restGet(pathOrUrl, { key = API_KEY } = {}) {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : REST_BASE + pathOrUrl;
  const res = await fetch(url, { headers: authHeaders(key) });
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {}
  return { url, status: res.status, contentType: res.headers.get("content-type") || "", body, text };
}

// Shrink a JSON value for display: arrays and large objects keep their first
// items and say how many were dropped; long strings are cut.
export function trim(value, { maxArray = 4, maxKeys = 12, maxString = 300, depth = 0, maxDepth = 6 } = {}) {
  const o = { maxArray, maxKeys, maxString, maxDepth, depth: depth + 1 };
  if (typeof value === "string") {
    return value.length > maxString ? value.slice(0, maxString) + `… [${value.length - maxString} more chars]` : value;
  }
  if (Array.isArray(value)) {
    if (depth >= maxDepth) return `[array of ${value.length}]`;
    const head = value.slice(0, maxArray).map((v) => trim(v, o));
    if (value.length > maxArray) head.push(`… ${value.length - maxArray} more items`);
    return head;
  }
  if (value && typeof value === "object") {
    if (depth >= maxDepth) return `{object with ${Object.keys(value).length} keys}`;
    const entries = Object.entries(value);
    const out = {};
    for (const [k, v] of entries.slice(0, maxKeys)) out[k] = trim(v, o);
    if (entries.length > maxKeys) out["…"] = `${entries.length - maxKeys} more keys`;
    return out;
  }
  return value;
}
