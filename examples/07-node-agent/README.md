# Node agent script

[`agent.mjs`](agent.mjs) is a dependency-free Node 18+ script that answers
concrete questions the way an LLM tool loop would: check `list_games` for
coverage, then read the solver node, then summarise. It refuses a stack that
is not solved instead of guessing, and shows what the server says for PLO
without a key.

## Run it

```sh
node examples/07-node-agent/agent.mjs
```

## Live output

Captured 2026-10-16 01:57 UTC without `POKERDATA_API_KEY`. Long arrays and objects are trimmed by [`../lib/show.mjs`](../lib/show.mjs), which says how much it cut; nothing else is edited.

```text
Q: 6-max NL 100bb, folded to me on the BTN with K9o. Open?
A: BTN with K9o at 100bb: raise to 2.5bb 100% (EV 0.11sb).

Q: 6-max NL 100bb, I open CO, BTN 3-bets, blinds fold. AQo?
A: CO with AQo at 100bb: call 50% (EV -2.45sb), raise to 23.2bb 50% (EV -2.45sb).

Q: Same spot but 25bb deep?
A: nl is not solved at 25bb. Stacks: 20, 30, 40, 50, 70, 100, 150, 200

BTN opens 550.88 of 1326 combos (41.5%) at 100bb: 91 hand classes = 85 pure + 6 mixed (A3o 34.5%, 53s 67%, Q3s 0.5%, 85s 1.5%, T5s 99.5%, 98o 50%)

PLO 100bb UTG first-in: get_node: This needs an API key. 6-max NL cash preflop (game "nl"), list_games, list_postflop_packs and the tree docs are free without one. Get a free trial key (100 requests, no card) or choose a plan at https://pokerdata.io/app/api, then send it as Authorization: Bearer pdk_…. Hand-history tools are free with any key, the free trial key included.
```
