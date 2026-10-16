"""Python twin of rangeStats() in pokerdata.mjs.

Counts for a compact get_range reply, computed from its [hand, frequency, evSb]
rows so they always add up: nonzero_hands = pure_hands + mixed_hands, where pure
means frequency exactly 1 and mixed means strictly between 0 and 1. The server's
own `summary` does not add up (it buckets 0.995 as pure and drops 0.005 from
both buckets), so examples use this instead.

Pass every row: compact get_range returns 120 rows unless `limit` (max 500) is
raised. `combos` weights hold'em classes as 6 (pair), 4 (suited) or 12
(offsuit) and is None when a hand is not a hold'em class.
"""
import re

_PAIR = re.compile(r"^([2-9TJQKA])\1$")
_SUITED = re.compile(r"^[2-9TJQKA]{2}s$")
_OFFSUIT = re.compile(r"^[2-9TJQKA]{2}o$")


def _holdem_combos(hand):
    if _PAIR.match(hand):
        return 6
    if _SUITED.match(hand):
        return 4
    if _OFFSUIT.match(hand):
        return 12
    return None


def range_stats(rows):
    nonzero = [(h, f) for h, f, *_ in rows if f > 0]
    pure = sum(1 for _h, f in nonzero if f == 1)
    combos = 0.0
    for h, f in nonzero:
        c = _holdem_combos(h)
        if c is None:
            combos = None
            break
        combos += f * c
    return {
        "nonzero_hands": len(nonzero),
        "pure_hands": pure,
        "mixed_hands": len(nonzero) - pure,
        "combos": None if combos is None else round(combos, 2),
    }
