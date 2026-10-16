# Python script

[`agent.py`](agent.py) uses only the standard library (Python 3.8+). It reads
coverage, the BTN open range and the CO vs BTN 3-bet node over MCP, then asks
the REST API for the same range so both transports are side by side.

## Run it

```sh
python3 examples/08-python-agent/agent.py
```

## Live output

Captured 2026-10-16 01:45 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
Games: nl, nl9, nlmtt8, nlh8-hydra, plo, plo5, plo9, plo6hu
Unsupported: ICM, PKO, satellites, asymmetric tournament stacks, 9-max MTT, tournament postflop, multiway postflop

BTN open at 100bb: 550.88 combos, 91 hand classes
Highest-EV opens: AA 19.2sb, KK 13.73sb, QQ 9.5sb, JJ 6.5sb, AKs 6.08sb

CO vs BTN 3-bet, AQo: Fold 0%, Call 50%, 95% 50%, AI 0%

REST /ranges/nl/range: HTTP 401, This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api.

PLO 100bb UTG: get_node: This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included.
```
