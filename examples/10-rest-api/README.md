# REST API and plain-text docs

The REST API at `https://pokerdata.io/api/v1/ranges` serves the same preflop
data as the MCP tools (`/{game}/config`, `/{game}/range`, `/{game}/node`),
plus `/ranges/openapi.json`, `/ranges/games` and per-game discovery such as
`/ranges/nl/v2`. `llms.txt` and `ranges.md` are the plain-text docs agents can
read directly.

Status codes observed without a key are recorded below as they were. At the
time of capture `games`, `config`, `range` and `node` returned `401` without a
key even for 6-max NL, which is free over MCP; a fix is in progress on the
server, so expect those to turn into `200`.

## Run it

```sh
bash examples/10-rest-api/rest.sh
```

The core call as a single copy-paste command:

```sh
curl -s "https://pokerdata.io/api/v1/ranges/nl/range?stack=100&spot=UTG_Fold_HJ_Fold_CO_Fold_BTN_60%25" \
  -H "Authorization: Bearer $POKERDATA_API_KEY"
```

## Live output

Captured 2026-10-16 01:57 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
$ GET https://pokerdata.io/api/v1/ranges/openapi.json  ->  HTTP 200
{
  "openapi": "3.1.0",
  "info": {
    "title": "Poker Study AI preflop ranges",
    "version": "1",
    "description": "schemaVersion 1. sizeBb, stacks, blinds, and ante are big blinds. evs are small blinds (evUnit sb) relative to folding (evBaseline fold, fold EV is 0). Two small blinds are one big blind; evs are not rescaled. An omitted hand weight means 0. full=1 writes all 169 hold'em hands with explicit 0. A siz… [347 more chars]"
  },
  "servers": [
    {
      "url": "https://www.pokerstudy.ai",
      "description": "pokerdata.io/api/v1/ranges proxies these /api/ranges paths."
    }
  ],
  "paths": {
    "/api/v1/ranges/{game}/node": {
      "get": {
        "operationId": "getNode",
        "summary": "Decision at a preflop node",
        "parameters": [
          {
            "name": "game",
            "in": "path",
            "required": true,
            "schema": "{object with 2 keys}"
          },
          {
            "name": "stack",
            "in": "query",
            "required": true,
            "schema": "{object with 1 keys}",
            "…": "1 more keys"
          },
          {
            "name": "history",
            "in": "query",
            "required": true,
            "schema": "{object with 1 keys}",
            "…": "1 more keys"
          },
          "… 3 more items"
        ],
        "responses": {
          "200": {
            "description": "Actions at the node. Weights omit hands at frequency 0 unless full=1.",
            "content": "{object with 1 keys}"
          }
        }
      }
    },
    "/api/v1/ranges/{game}/range": {
      "get": {
        "operationId": "getRange",
        "summary": "Range for one action",
        "parameters": [
          {
            "name": "game",
            "in": "path",
            "required": true,
            "schema": "{object with 2 keys}"
          },
          {
            "name": "stack",
            "in": "query",
            "required": true,
            "schema": "{object with 1 keys}",
            "…": "1 more keys"
          },
          {
            "name": "spot",
            "in": "query",
            "required": true,
            "schema": "{object with 1 keys}",
            "…": "1 more keys"
          },
          "… 2 more items"
        ],
        "responses": {
          "200": {
            "description": "One action's weights and, when the bundle stored them, its raise-to.",
            "content": "{object with 1 keys}"
          }
        }
      }
    },
    "/api/v1/ranges/{game}/config": {
      "get": {
        "operationId": "getConfig",
        "summary": "Table config for one stack",
        "parameters": [
          {
            "name": "game",
            "in": "path",
            "required": true,
            "schema": "{object with 2 keys}"
          },
          {
            "name": "stack",
            "in": "query",
            "required": true,
            "schema": "{object with 1 keys}",
            "…": "1 more keys"
          }
        ],
        "responses": {
          "200": {
            "description": "Seats, stacks, blinds, ante, open sizes, and which fields are unverified.",
            "content": "{object with 1 keys}"
          }
        }
      }
    }
  },
  "…": "1 more keys"
}

$ GET https://pokerdata.io/api/v1/ranges/nl/v2  ->  HTTP 200
{
  "game": "nl",
  "version": 2,
  "generatedAt": "2026-06-09T19:18:20.659Z",
  "bundleCount": 48,
  "stacks": [20, 30, 40, 50, 70, 100, 150, 200],
  "positions": ["BB", "BTN", "CO", "HJ", "SB", "UTG"],
  "endpoints": {
    "range": "/api/v1/ranges/nl/v2/range?stack={bb}&spot={path}[&hand={class}]",
    "node": "/api/v1/ranges/nl/v2/node?stack={bb}&history={path}[&hand={class}][&full=1]",
    "config": "/api/v1/ranges/nl/v2/config?stack={bb}",
    "spots": "/api/v1/ranges/nl/v2/spots?stack={bb}"
  },
  "docs": "/api"
}

$ GET https://pokerdata.io/api/v1/ranges/games  ->  HTTP 401
{
  "error": "This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api.",
  "docs": "https://docs.pokerdata.io"
}

$ GET https://pokerdata.io/api/v1/ranges/nl/config?stack=100  ->  HTTP 401
{
  "error": "This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api.",
  "docs": "https://docs.pokerdata.io"
}

$ GET https://pokerdata.io/api/v1/ranges/nl/range?stack=100&spot=UTG_Fold_HJ_Fold_CO_Fold_BTN_60%25  ->  HTTP 401
{
  "error": "This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api.",
  "docs": "https://docs.pokerdata.io"
}

$ GET https://pokerdata.io/api/v1/ranges/nl/node?stack=100&history=UTG_Fold_HJ_Fold_CO_60%25_BTN&hand=AQo  ->  HTTP 401
{
  "error": "This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api.",
  "docs": "https://docs.pokerdata.io"
}

$ GET https://pokerdata.io/api/v1/ranges/plo/config?stack=100  ->  HTTP 401
{
  "error": "This endpoint requires an API key. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api.",
  "docs": "https://docs.pokerdata.io"
}

$ GET https://pokerdata.io/llms.txt  ->  HTTP 200
# PokerData

> A downloadable library of GTO preflop solver sims — pot-limit Omaha (PLO,
> Omaha) and no-limit hold'em (NLHE, Texas hold'em / holdem) — sold per game as
> one-time purchases, plus a paid HTTP ranges API serving the same preflop
> ranges as JSON.

Packs are raw solver .7z exports, opened in a free viewer, plus
zipped JSON for the 8-max tournament ladder and .7z postflop archives. Each
pack is $50, one-time. Signing in does not include the file. A game bundle is
offered when it costs less than buying every pack in that game. A free
in-browser range explorer previews packs before you buy. The API additionally
… 195 more lines

$ GET https://pokerdata.io/ranges.md  ->  HTTP 200
# Preflop ranges contract

schemaVersion 1. Machine-readable spec: <https://docs.pokerdata.io/openapi.yaml>

These reads are served at `https://pokerdata.io/api/v1/ranges`. The same answers are on the docs: [ranges contract](https://docs.pokerdata.io/ranges) for what is shared, then one page per game — [NLHE 6-max](https://docs.pokerdata.io/nlhe), [NLHE tournament 8-max](https://docs.pokerdata.io/nlmtt8), [PLO 6-max](https://docs.pokerdata.io/plo), [PLO 9-max](https://docs.pokerdata.io/plo9).

## Units

| Field | Unit |
| --- | --- |
| stack, stacks, blinds, ante, sizeBb, openSizes.sizeBb | big blinds (bb) |
| sizePctPot | percent of the pot after calling |
| evs | small blinds (sb). `evUnit` is `"sb"`. `evBaseline` `"fold"` means every stored fold EV is 0, so those evs are relative to folding |
| omitted weight | 0. `full=1` on a hold'em node writes all 169 hands with explicit 0. EVs are only present for hands the bundle scored, including a scored hand at frequency 0. `full=1` leaves evs only where the bundle scored the hand |

Two small blinds are one big blind. evs stay in small blinds.
… 82 more lines
```
