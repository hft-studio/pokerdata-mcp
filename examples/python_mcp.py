"""Fetch a 6-max NL range from the PokerData MCP server with plain HTTP.

    python examples/python_mcp.py
    POKERDATA_API_KEY=pdk_... python examples/python_mcp.py   # for paid games
"""
import json
import os
import urllib.request

URL = "https://pokerdata.io/api/mcp"


def call_tool(name, arguments):
    body = {"jsonrpc": "2.0", "id": 1, "method": "tools/call",
            "params": {"name": name, "arguments": arguments}}
    headers = {"Content-Type": "application/json"}
    key = os.environ.get("POKERDATA_API_KEY")
    if key:
        headers["Authorization"] = f"Bearer {key}"
    req = urllib.request.Request(URL, json.dumps(body).encode(), headers)
    with urllib.request.urlopen(req) as res:
        reply = json.load(res)
    content = reply["result"]["content"][0]["text"]
    if reply["result"].get("isError"):
        raise RuntimeError(content)
    return json.loads(content)


if __name__ == "__main__":
    rng = call_tool("get_range", {"game": "nl", "stack": 100, "spot": "UTG_60%"})
    # Compact rows are [hand, frequency, evSb]; pass detail="full" for maps.
    opened = [hand for hand, freq, _ev in rng["range"] if freq >= 0.5]
    print(f"UTG opens {rng['combos']} combos at 100bb; {len(opened)} hand classes at 50%+")
    print(call_tool("get_range", {"game": "nl", "stack": 100, "spot": "UTG_60%", "hand": "AJo"}))
