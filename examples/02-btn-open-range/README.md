# BTN open range, 6-max NL 100bb

"What does the button open at 100bb when it folds to them?" Find the spot,
read the node, then pull the opening range and one mixed hand. Free, no key.

Spot names are action paths: `UTG_Fold_HJ_Fold_CO_Fold_BTN` is the BTN's
decision, and appending the action (`_60%`, a 2.5bb open) names the range.

## Run it

```sh
bash examples/02-btn-open-range/btn-open.sh
```

The core call as a single copy-paste command:

```sh
curl -s https://pokerdata.io/api/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_range","arguments":{"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%"}}}'
```

## Live output

Captured 2026-10-16 01:45 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
$ tools/call list_spots {"game":"nl","stack":100,"contains":"CO_Fold_BTN","depth":1,"limit":3}
{
  "game": "nl",
  "stack": 100,
  "total": 9270,
  "matched": 3,
  "offset": 0,
  "returned": 3,
  "nextOffset": null,
  "spots": [
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

$ tools/call get_node {"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_Fold_BTN"}
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "history": "UTG_Fold_HJ_Fold_CO_Fold_BTN",
  "actor": "BTN",
  "continuingCombos": 550.88,
  "actions": [
    {
      "action": "Fold",
      "kind": "fold",
      "combos": 775.12
    },
    {
      "action": "60%",
      "kind": "raise",
      "sizePct": 60,
      "combos": 550.88,
      "sizeBb": 2.5,
      "sizePctPot": 60
    }
  ],
  "hint": "Compact node output gives action totals. Pass \"hand\" for its exact mixed strategy or use get_range for an action range."
}

$ tools/call get_range {"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%"}
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "spot": "UTG_Fold_HJ_Fold_CO_Fold_BTN_60%",
  "actor": "BTN",
  "combos": 550.88,
  "summary": {
    "nonzeroHands": 91,
    "pureHands": 86,
    "mixedHands": 4,
    "returned": 91,
    "omitted": 0
  },
  "columns": ["hand", "frequency", "evSb"],
  "range": [
    ["22", 1, 0.11],
    ["33", 1, 0.2],
    ["44", 1, 0.34],
    ["55", 1, 0.5],
    ["66", 1, 0.89],
    ["77", 1, 1.06],
    ["88", 1, 1.6],
    ["99", 1, 2.42],
    "… 83 more items"
  ]
}

$ tools/call get_range {"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_Fold_BTN_60%","hand":"A3o"}
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "spot": "UTG_Fold_HJ_Fold_CO_Fold_BTN_60%",
  "actor": "BTN",
  "hand": "A3o",
  "frequency": 0.345,
  "evSb": 0,
  "combos": 550.88
}
```
