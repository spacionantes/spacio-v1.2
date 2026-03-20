

## Problem

The score formula uses `Math.pow(ratio, 0.25)` (fourth root), which dramatically inflates low ratios. For example:
- ratio = 25% → score = 71
- ratio = 10% → score = 56
- ratio = 6% → score = 50

This makes a nearly empty space appear "well used."

## Solution

Replace the fourth-root formula with a **linear score** that directly reflects the usage ratio. The score simply equals the ratio percentage, so a 25% occupied space gets a score of 25, not 71.

## Changes

**`src/pages/Diagnostic.tsx`** — one-line change in `calculateIntensiScore`:

Replace `Math.pow(ratio, 0.25)` with just `ratio`:
```ts
const scoreRaw = ratio;
```

This makes score and ratio consistent. The advice thresholds (30, 60) and gauge colors already work well with this linear mapping.

