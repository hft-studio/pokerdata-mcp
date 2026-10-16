# CO open vs BTN 3-bet, 6-max NL 100bb

CO opens to 2.5bb, BTN 3-bets to 7.51bb, the blinds fold. What does BTN
3-bet with, and what does CO do with AQo? Free, no key.

In nodes after the hero has already put money in, EVs are not relative to
folding at that node: the compact reply shows AQo's fold at `-5` sb (the 2.5bb
open is lost). Pass `detail: "full"` to get `evBaseline` (it is `null` here).

## Run it

```sh
bash examples/03-co-vs-btn-3bet/co-vs-3bet.sh
```

The core call as a single copy-paste command:

```sh
curl -s https://pokerdata.io/api/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_node","arguments":{"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO","hand":"AQo"}}}'
```

## Live output

Captured 2026-10-16 01:45 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
$ tools/call get_node {"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN"}
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "history": "UTG_Fold_HJ_Fold_CO_60%_BTN",
  "actor": "BTN",
  "continuingCombos": 191.5,
  "actions": [
    {
      "action": "Fold",
      "kind": "fold",
      "combos": 1134.53
    },
    {
      "action": "Call",
      "kind": "call",
      "combos": 33.51
    },
    {
      "action": "77%",
      "kind": "raise",
      "sizePct": 77,
      "combos": 157.99,
      "sizeBb": 7.51,
      "sizePctPot": 77
    }
  ],
  "hint": "Compact node output gives action totals. Pass \"hand\" for its exact mixed strategy or use get_range for an action range."
}

$ tools/call get_range {"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%"}
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "spot": "UTG_Fold_HJ_Fold_CO_60%_BTN_77%",
  "actor": "BTN",
  "combos": 157.99,
  "summary": {
    "nonzeroHands": 41,
    "pureHands": 6,
    "mixedHands": 33,
    "returned": 41,
    "omitted": 0
  },
  "columns": ["hand", "frequency", "evSb"],
  "range": [
    ["44", 0.03, 0],
    ["55", 0.305, 0],
    ["66", 0.67, 0.38],
    ["77", 0.785, 0.69],
    ["88", 0.805, 1.17],
    ["99", 0.83, 1.85],
    ["AA", 1, 33.98],
    ["A3s", 0.025, -0.03],
    "… 33 more items"
  ]
}

$ tools/call get_node {"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO"}
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "history": "UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO",
  "actor": "CO",
  "continuingCombos": 217.14,
  "actions": [
    {
      "action": "Fold",
      "kind": "fold",
      "combos": 161.2
    },
    {
      "action": "Call",
      "kind": "call",
      "combos": 149.57
    },
    {
      "action": "95%",
      "kind": "raise",
      "sizePct": 95,
      "combos": 62.35,
      "sizeBb": 23.2,
      "sizePctPot": 95
    },
    {
      "action": "AI",
      "kind": "allin",
      "combos": 5.22,
      "sizeBb": 100,
      "sizePctPot": null,
      "sizeReason": "All-in raise-to is the solved stack depth in bb. It is not a pot-percent size."
    }
  ],
  "hint": "Compact node output gives action totals. Pass \"hand\" for its exact mixed strategy or use get_range for an action range."
}

$ tools/call get_node {"game":"nl","stack":100,"history":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO","hand":"AQo"}
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "history": "UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO",
  "actor": "CO",
  "continuingCombos": 217.14,
  "hand": "AQo",
  "actions": [
    {
      "action": "Fold",
      "kind": "fold",
      "combos": 161.2,
      "frequency": 0,
      "evSb": -5
    },
    {
      "action": "Call",
      "kind": "call",
      "combos": 149.57,
      "frequency": 0.5,
      "evSb": -2.45
    },
    {
      "action": "95%",
      "kind": "raise",
      "sizePct": 95,
      "combos": 62.35,
      "sizeBb": 23.2,
      "sizePctPot": 95,
      "frequency": 0.5,
      "evSb": -2.45
    },
    {
      "action": "AI",
      "kind": "allin",
      "combos": 5.22,
      "sizeBb": 100,
      "sizePctPot": null,
      "sizeReason": "All-in raise-to is the solved stack depth in bb. It is not a pot-percent size.",
      "frequency": 0,
      "evSb": -8.59
    }
  ]
}

$ tools/call get_range {"game":"nl","stack":100,"spot":"UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO_95%"}
{
  "game": "nl",
  "version": 2,
  "stack": 100,
  "spot": "UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO_95%",
  "actor": "CO",
  "combos": 62.35,
  "summary": {
    "nonzeroHands": 28,
    "pureHands": 3,
    "mixedHands": 24,
    "returned": 28,
    "omitted": 0
  },
  "columns": ["hand", "frequency", "evSb"],
  "range": [
    ["88", 0.075, -2.86],
    ["AA", 1, 55.96],
    ["A3s", 0.155, -5],
    ["A4s", 0.42, -4.95],
    ["A5s", 0.455, -4.73],
    ["A6s", 0.225, -4.99],
    ["A7s", 0.275, -5],
    ["A8s", 0.395, -4.88],
    ["AJo", 0.125, -5],
    ["AQo", 0.5, -2.45],
    ["AKs", 1, 7.77],
    ["AKo", 0.665, 4.03],
    ["76s", 0.005, -4.97],
    ["T8s", 0.08, -5],
    ["T9s", 0.06, -4.42],
    ["J9s", 0.23, -4.97],
    ["K9s", 0.16, -4.84],
    ["TT", 0.18, 0.84],
    ["JTs", 0.08, -3.91],
    ["QTs", 0.02, -4.02],
    ["KTs", 0.07, -3.63],
    ["JJ", 0.725, 4.39],
    ["QJs", 0.035, -3.86],
    ["KJs", 0.88, -3.26],
    ["QQ", 0.845, 14.38],
    ["KQs", 0.67, -2.77],
    ["KQo", 0.255, -5],
    ["KK", 1, 30.73]
  ]
}
```
