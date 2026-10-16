// One canonical example call for every tool the PokerData MCP server exposes.
// The smoke test and examples/mcp-tools/capture.mjs both run this list, so the
// per-tool pages always show the call that was actually made.
//
// tier:
//   free      works without a key (6-max NL cash preflop, coverage and docs tools)
//   key       needs a pdk_ key (paid games, postflop, coaching)
//   account   needs any key, Starter included; reads that key's own account
//   mutating  would write to the account; skipped unless --include-mutating is
//             passed, and even then called only with schema-invalid input

const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const PACK = "nlhe-srp-co-vs-bb-100bb";
const BOARD = "3h 3d 2s";

export const TOOL_CALLS = [
  // Coverage and docs
  { name: "list_games", tier: "free", group: "Coverage and docs",
    what: "Every game with its stack depths and positions, plus what is explicitly unsupported.",
    args: {} },
  { name: "list_datasets", tier: "free", group: "Coverage and docs",
    what: "Preflop datasets with bundle counts per stack.",
    args: {} },
  { name: "get_tree_docs", tier: "free", group: "Coverage and docs",
    what: "Tree documentation for one dataset (6-max NL).",
    args: { dataset: "nl/v2" } },
  { name: "get_exploitability", tier: "free", group: "Coverage and docs",
    what: "Published exploitability for a preflop dataset (none is published for nl).",
    args: { game: "nl" } },
  { name: "list_postflop_packs", tier: "free", group: "Coverage and docs",
    what: "Heads-up postflop packs: preflop line, pot, stacks, sizing trees, solved boards.",
    args: { variant: "nlhe" } },

  // Preflop (free for game "nl")
  { name: "get_config", tier: "free", group: "Preflop",
    what: "Table config for 6-max NL at 100bb: seats, blinds, EV unit.",
    args: { game: "nl", stack: 100 } },
  { name: "list_spots", tier: "free", group: "Preflop",
    what: "Spots at 100bb whose history contains CO, one decision deep.",
    args: { game: "nl", stack: 100, contains: "CO", depth: 1, limit: 10 } },
  { name: "get_range", tier: "free", group: "Preflop",
    what: "BTN opening range at 100bb when folded to (rows are [hand, frequency, evSb]; limit 500 returns every row).",
    args: { game: "nl", stack: 100, spot: "UTG_Fold_HJ_Fold_CO_Fold_BTN_60%", limit: 500 } },
  { name: "get_node", tier: "free", group: "Preflop",
    what: "CO facing a BTN 3-bet at 100bb: every action for AQo.",
    args: { game: "nl", stack: 100, history: "UTG_Fold_HJ_Fold_CO_60%_BTN_77%_SB_Fold_BB_Fold_CO", hand: "AQo" } },
  { name: "get_range_metadata", tier: "free", group: "Preflop",
    what: "Bundle metadata behind the UTG open at 100bb.",
    args: { game: "nl", stack: 100, path: "UTG_60%" } },

  // Postflop and coaching (key)
  { name: "get_postflop_node", tier: "key", group: "Postflop",
    what: "Root flop node on 3h 3d 2s, CO opens and BB calls, 100bb.",
    args: { pack: PACK, board: BOARD } },
  { name: "get_postflop_range", tier: "key", group: "Postflop",
    what: "BB's flop check range on 3h 3d 2s (75% tree).",
    args: { pack: PACK, tree: "75", board: BOARD, path: ["Check"] } },
  { name: "explain_combo", tier: "key", group: "Coaching",
    what: "Exact action mix and EV for AsKh at the flop root on 3h 3d 2s.",
    args: { pack: PACK, board: BOARD, combo: "AsKh" } },
  { name: "get_board_report", tier: "key", group: "Coaching",
    what: "Aggregated flop strategy over paired boards in the CO vs BB pack.",
    args: { pack: PACK, filters: { pairedness: "paired" } } },
  { name: "compare_strategies", tier: "key", group: "Coaching",
    what: "UTG with A5s at 100bb vs 40bb (preflop comparison).",
    args: {
      domain: "preflop",
      baseline: { game: "nl", stack: 100, history: "UTG", hand: "A5s" },
      comparison: { game: "nl", stack: 40, history: "UTG", hand: "A5s" },
    } },

  // Your hands (any key)
  { name: "get_upload_link", tier: "account", group: "Your hands",
    what: "Hosted hand-history upload page URL for this key.",
    args: {} },
  { name: "find_hands", tier: "account", group: "Your hands",
    what: "Most recent uploaded hands.",
    args: { sort: "recent", limit: 5 } },
  { name: "get_hand_results", tier: "account", group: "Your hands",
    what: "Cumulative results graph points across uploaded hands.",
    args: { max_points: 20 } },
  { name: "list_my_sessions", tier: "account", group: "Your hands",
    what: "Uploaded sessions.",
    args: { limit: 5 } },
  { name: "get_session_summary", tier: "account", group: "Your hands",
    what: "Summary of one session (nil UUID: a guaranteed-missing id).",
    args: { session_id: NIL_UUID } },
  { name: "get_tournament_results", tier: "account", group: "Your hands",
    what: "Uploaded tournament summaries.",
    args: { limit: 5 } },
  { name: "list_my_opponents", tier: "account", group: "Your hands",
    what: "Tracked opponents by hand count.",
    args: { limit: 5, min_hands: 1, sort: "hands" } },
  { name: "get_opponent_notes", tier: "account", group: "Your hands",
    what: "Notes for one opponent (nil UUID: a guaranteed-missing id).",
    args: { opponent_id: NIL_UUID } },
  { name: "get_opponent_limp_range", tier: "account", group: "Your hands",
    what: "Showdown-based open-limp hand classes across opponents.",
    args: { limit: 10 } },

  // Solve queue (key)
  { name: "list_queued_solves", tier: "account", group: "Solve queue",
    what: "This key's queued solve requests.",
    args: { limit: 5 } },
  { name: "get_queued_solve", tier: "account", group: "Solve queue",
    what: "One queued solve by id (an id that does not exist).",
    args: { queue_id: 999999999 } },
  { name: "list_library_solutions", tier: "account", group: "Solve queue",
    what: "Solutions in this key's library.",
    args: { limit: 5 } },

  // Mutating: skipped by default, and schema-invalid input even when included
  { name: "enqueue_solve", tier: "mutating", group: "Solve queue",
    what: "Dry call: an empty title and pot 0 both fail the input schema (minLength 1, exclusiveMinimum 0), so the request is meant to be rejected before anything is recorded.",
    args: { title: "", board: "Ks 7d 2c", pot: 0, effective_stack: 97.5 } },
  { name: "upload_hand_history", tier: "mutating", group: "Your hands",
    what: "Dry call: empty text fails the input schema (minLength 1), so the request is meant to be rejected before anything is ingested.",
    args: { filename: "dry-run.txt", text: "" } },
];

export const TIER_TEXT = {
  free: "Free, no key",
  key: "Needs a pdk_ key",
  account: "Needs any key (Starter included); reads that key's account",
  mutating: "Writes to the account; skipped unless `--include-mutating` is passed",
};

// The two mutating tools are never called unless the caller opts in with this
// flag, with or without a key: an account-writing tool should not run just
// because a key happens to be in the environment.
export const INCLUDE_MUTATING_FLAG = "--include-mutating";
export const MUTATING_SKIP_NOTE =
  `mutating tools are skipped unless ${INCLUDE_MUTATING_FLAG} is passed`;

// Account-tier replies contain that key's own hands, opponents and solve
// queue, so capture.mjs refuses to write those pages from a keyed run.
export const ACCOUNT_SKIP_NOTE =
  "a key is set, so the reply would be this key's own account data";

// Judge one tool response against what its tier should return.
// Returns { result: "PASS" | "WARN" | "FAIL", status: short live-status label }.
export function classify(call, res, hasKey, isKeyGate) {
  const gated = isKeyGate(res);
  if (res.status === 429) return { result: "FAIL", status: "HTTP 429 rate limited (keyless: 200 calls/day per IP)" };
  if (res.status !== 200) return { result: "FAIL", status: `HTTP ${res.status}` };
  if (call.tier === "free") {
    if (!res.isError) return { result: "PASS", status: "live data, no key" };
    return { result: "FAIL", status: gated ? "key gate on a free tool" : "tool error" };
  }
  if (!hasKey) {
    return gated
      ? { result: "PASS", status: "key gate observed (no key in this run)" }
      : { result: "WARN", status: "expected a key gate, got something else" };
  }
  if (gated) return { result: "FAIL", status: "key gate despite a key" };
  if (call.tier === "mutating") {
    return res.isError
      ? { result: "PASS", status: "rejected dry input (nothing written)" }
      : { result: "WARN", status: "dry input was accepted" };
  }
  if (call.tier === "account") return { result: "PASS", status: res.isError ? "account reply (error)" : "live account data" };
  return res.isError ? { result: "FAIL", status: "tool error with key" } : { result: "PASS", status: "live data, with key" };
}

// Data checks that only make sense with a key: one per paid game family.
export const PAID_DATA_CALLS = [
  { label: "nlmtt8 30bb UTG first-in node", name: "get_node", args: { game: "nlmtt8", stack: 30, history: "UTG" } },
  { label: "plo 100bb UTG first-in node", name: "get_node", args: { game: "plo", stack: 100, history: "UTG" } },
  { label: "plo9 100bb UTG first-in node", name: "get_node", args: { game: "plo9", stack: 100, history: "UTG" } },
  { label: "postflop CO vs BB 3h 3d 2s root", name: "get_postflop_node", args: { pack: PACK, board: BOARD } },
];
