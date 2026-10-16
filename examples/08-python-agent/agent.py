"""PokerData from Python 3.8+ with only the standard library.

Uses MCP over plain HTTP for strategy, and the REST API for the same data so
you can see both side by side.

    python3 examples/08-python-agent/agent.py
    POKERDATA_API_KEY=pdk_... python3 examples/08-python-agent/agent.py
"""
import json
import os
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "lib"))
from range_stats import range_stats  # noqa: E402

MCP_URL = os.environ.get("POKERDATA_MCP_URL", "https://pokerdata.io/api/mcp")
REST = os.environ.get("POKERDATA_REST_URL", "https://pokerdata.io/api/v1")
KEY = os.environ.get("POKERDATA_API_KEY", "").strip()
TIMEOUT = float(os.environ.get("POKERDATA_TIMEOUT", "30"))
RATE_LIMIT_HINT = ("Keyless access allows 200 calls/day per IP;"
                   " set POKERDATA_API_KEY or wait for the daily reset.")


def _headers():
    h = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
    if KEY:
        h["Authorization"] = f"Bearer {KEY}"
    return h


def _read(req):
    """Return (status, raw bytes) for a request, following an HTTP error body."""
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as res:
            return res.status, res.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except urllib.error.URLError as e:
        raise RuntimeError(f"{req.full_url} failed: {e.reason} (timeout is {TIMEOUT}s)")
    except socket.timeout:
        raise RuntimeError(f"{req.full_url} timed out after {TIMEOUT}s")


def _json(status, raw, what):
    """Parse a reply body, or raise an error that says what came back instead."""
    try:
        return json.loads(raw.decode("utf-8", "replace"))
    except ValueError:
        snippet = raw.decode("utf-8", "replace")[:200] or "<empty>"
        hint = f" {RATE_LIMIT_HINT}" if status == 429 else ""
        raise RuntimeError(f"{what}: HTTP {status}, reply is not JSON: {snippet}{hint}")


def call_tool(name, arguments):
    """Return the tool's parsed JSON; raise RuntimeError on a tool error."""
    body = {"jsonrpc": "2.0", "id": 1, "method": "tools/call",
            "params": {"name": name, "arguments": arguments}}
    req = urllib.request.Request(MCP_URL, json.dumps(body).encode(), _headers())
    status, raw = _read(req)
    reply = _json(status, raw, name)
    if "error" in reply:
        raise RuntimeError(f"{name}: HTTP {status} {reply['error'].get('message')}")
    content = (reply.get("result") or {}).get("content") or []
    text = next((c.get("text") for c in content if c.get("type") == "text"), None)
    if not isinstance(text, str):
        raise RuntimeError(f"{name}: HTTP {status}, no text content in the reply: {str(reply)[:200]}")
    if reply["result"].get("isError"):
        raise RuntimeError(f"{name}: {text}")
    try:
        return json.loads(text)
    except ValueError:
        raise RuntimeError(f"{name}: tool result is not JSON: {text[:200]}")


def rest_get(path):
    """Return (status, parsed body) for a REST GET."""
    req = urllib.request.Request(REST + path, headers=_headers())
    status, raw = _read(req)
    return status, _json(status, raw, f"GET {path}")


def main():
    # Coverage first, like an agent should.
    games = call_tool("list_games", {})
    print("Games:", ", ".join(g for g in games if not g.startswith("_")))
    print("Unsupported:", ", ".join(games["_coverage"]["unsupported"]))

    # 6-max NL 100bb: BTN open range, compact rows are [hand, frequency, evSb].
    spot = "UTG_Fold_HJ_Fold_CO_Fold_BTN_60%"
    # limit 500 returns every row, so the counts below cover the whole range.
    rng = call_tool("get_range", {"game": "nl", "stack": 100, "spot": spot, "limit": 500})
    stats = range_stats(rng["range"])
    best = sorted(rng["range"], key=lambda r: r[2], reverse=True)[:5]
    print(f"\nBTN open at 100bb: {stats['combos']} combos, {stats['nonzero_hands']} hand classes"
          f" = {stats['pure_hands']} pure + {stats['mixed_hands']} mixed")
    print("Highest-EV opens:", ", ".join(f"{h} {ev}sb" for h, _f, ev in best))

    # CO facing a BTN 3-bet with AQo.
    node = call_tool("get_node", {"game": "nl", "stack": 100,
                                  "history": "UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO",
                                  "hand": "AQo"})
    mix = ", ".join(f"{a['action']} {a['frequency']:.0%}" for a in node["actions"])
    print(f"\nCO vs BTN 3-bet, AQo: {mix}")

    # Same range over REST (needs a key today; prints what the server says).
    status, body = rest_get("/ranges/nl/range?stack=100&spot=" + urllib.parse.quote(spot))
    if status == 200:
        print(f"\nREST /ranges/nl/range: HTTP 200, {body.get('combos')} combos")
    else:
        print(f"\nREST /ranges/nl/range: HTTP {status}, {body.get('error')}")

    # PLO (key).
    try:
        plo = call_tool("get_node", {"game": "plo", "stack": 100, "history": "UTG"})
        print("\nPLO 100bb UTG:", ", ".join(f"{a['action']} {a['combos']}" for a in plo["actions"]))
    except RuntimeError as err:
        print(f"\nPLO 100bb UTG: {err}")


if __name__ == "__main__":
    main()
