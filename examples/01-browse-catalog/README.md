# Browse the catalog

An agent should check coverage before asking for a strategy: which games
exist, at which stacks, and what is explicitly unsupported (ICM, PKO, multiway
postflop and so on come back as unsupported rather than a cash stand-in).
Everything here is free and needs no key.

Tools: `list_games`, `list_datasets`, `get_config`, `list_spots`, `list_postflop_packs`.

## Run it

```sh
bash examples/01-browse-catalog/catalog.sh
```

The core call as a single copy-paste command:

```sh
curl -s https://pokerdata.io/api/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_games","arguments":{}}}'
```

## Live output

Captured 2026-10-16 01:45 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
$ tools/call list_games {}
{
  "_coverage": {
    "format": ["cash", "mtt_chip_ev"],
    "supportedObjectives": ["cash_game_ev", "solver_ev", "chip_ev"],
    "supportedTournament": {
      "game": "nlmtt8",
      "format": "mtt",
      "objective": "chip_ev",
      "tableSize": 8,
      "anteBb": 1
    },
    "unsupported": ["ICM", "PKO", "satellites", "asymmetric tournament stacks", "9-max MTT", "tournament postflop", "multiway postflop"]
  },
  "nl": {
    "stacks": [20, 30, 40, 50, 70, 100, 150, 200],
    "positions": ["BB", "BTN", "CO", "HJ", "SB", "UTG"]
  },
  "nl9": {
    "stacks": [100, 200],
    "positions": ["BB", "BTN", "CO", "HJ", "LJ", "SB", "UTG", "UTG1", "UTG2"]
  },
  "nlmtt8": {
    "stacks": [10, 15, 20, 30, 40, 50, 75, 100, 200, 300],
    "positions": ["BB", "BTN", "CO", "HJ", "LJ", "SB", "UTG", "UTG1"]
  },
  "nlh8-hydra": {
    "stacks": [10, 20, 30, 60],
    "positions": ["BB", "BTN", "CO", "HJ", "LJ", "SB", "UTG", "UTG1"]
  },
  "plo": {
    "stacks": [12, 20, 30, 40, 50, 75, 100, 150, 200],
    "positions": ["BB", "BTN", "CO", "HJ", "SB", "UTG"]
  },
  "plo5": {
    "stacks": [100],
    "positions": ["LJ", "HJ", "CO", "BTN", "SB", "BB"]
  },
  "plo9": {
    "stacks": [60, 100],
    "positions": ["BB", "BTN", "CO", "HJ", "LJ", "SB", "UTG", "UTG1", "UTG2"]
  },
  "plo6hu": {
    "stacks": [100],
    "positions": ["BTN", "BB"]
  }
}

$ tools/call list_datasets {}
{
  "source": "data/tree-docs",
  "generated": "2026-10-13",
  "preflopExploitability": "not available",
  "datasets": [
    {
      "id": "nl/v2",
      "rows": 48,
      "stacks": [20, 30, 40, "… 5 more items"],
      "positions": ["BB", "BTN", "CO", "… 3 more items"],
      "analyzed": 48,
      "formats": ["5p-0.5bb"],
      "perNode": false
    },
    {
      "id": "nl9",
      "rows": 18,
      "stacks": [100, 200],
      "positions": ["BB", "BTN", "CO", "… 6 more items"],
      "analyzed": 18,
      "formats": ["10p-3bb", "sb-ante-5p-3bbcap-GG"],
      "perNode": false
    },
    {
      "id": "nlmtt8",
      "rows": 80,
      "stacks": [10, 15, 20, "… 7 more items"],
      "positions": ["BB", "BTN", "CO", "… 5 more items"],
      "analyzed": 80,
      "formats": ["vs50bb", "", "BB-ANTE"],
      "perNode": false
    },
    "… 4 more items"
  ],
  "readme": "Call get_tree_docs with a dataset id for the write-up and per-stack counts."
}

$ tools/call get_config {"game":"nl","stack":100}
{
  "schemaVersion": 1,
  "units": {
    "stack": "bb",
    "stacks": "bb",
    "blinds": "bb",
    "ante": "bb",
    "sizeBb": "bb",
    "openSizes": "bb",
    "evs": "sb"
  },
  "game": "nl",
  "stack": 100,
  "seats": ["UTG", "HJ", "CO", "BTN", "SB", "BB"],
  "stacks": [100, 100, 100, 100, 100, 100],
  "blinds": {
    "sb": 0.5,
    "bb": 1
  },
  "ante": null,
  "antePostedBy": null,
  "stackIncludesAnte": null,
  "treeSizes": null,
  "openSizes": null,
  "evUnit": "sb",
  "evBaseline": "fold",
  "…": "3 more keys"
}

$ tools/call list_spots {"game":"nl","stack":100,"contains":"CO","depth":1,"limit":10}
{
  "game": "nl",
  "stack": 100,
  "total": 9270,
  "matched": 4,
  "offset": 0,
  "returned": 4,
  "nextOffset": null,
  "spots": [
    {
      "history": "UTG_Fold_HJ_Fold_CO",
      "depth": 1
    },
    {
      "history": "UTG_Fold_HJ_Fold_CO_Fold_BTN",
      "depth": 1
    },
    {
      "history": "UTG_Fold_HJ_Fold_CO_Fold_BTN_Fold_SB",
      "depth": 1
    },
    {
      "history": "UTG_Fold_HJ_Fold_CO_Fold_BTN_Fold_SB_Call_BB",
      "depth": 1
    }
  ]
}

$ tools/call list_postflop_packs {"variant":"nlhe"}
{
  "packs": [
    {
      "id": "nlhe-srp-co-vs-bb-100bb",
      "title": "CO opens, BB calls · 100bb",
      "preflopLine": "CO opens, BB calls",
      "stackBb": 100,
      "oopPos": "BB",
      "ipPos": "CO",
      "potBb": 5.5,
      "effStackBb": 97.5,
      "hasEv": true,
      "…": "4 more keys"
    },
    {
      "id": "nlhe-3bet-btn-vs-co-100bb",
      "title": "CO opens, BTN raises, CO calls · 100bb",
      "preflopLine": "CO opens, BTN raises, CO calls",
      "stackBb": 100,
      "oopPos": "CO",
      "ipPos": "BTN",
      "potBb": 16.52,
      "effStackBb": 92.49,
      "hasEv": true,
      "…": "4 more keys"
    },
    {
      "id": "nlhe-3bet-btn-vs-sb-100bb",
      "title": "BTN opens, SB raises, BTN calls · 100bb",
      "preflopLine": "BTN opens, SB raises, BTN calls",
      "stackBb": 100,
      "oopPos": "SB",
      "ipPos": "BTN",
      "potBb": 24,
      "effStackBb": 88.5,
      "hasEv": true,
      "…": "4 more keys"
    },
    "… 19 more items"
  ],
  "hint": "Pass \"pack\" for one pack's per-board detail and that tree's exploitability. Use the -flop33 id for the 33% tree."
}
```
