# Requirements: Loyalty Points Calculator (TDD Starter)

> No implementation exists yet. Use this spec with Copilot to drive a
> Red -> Green -> Refactor loop: write a failing test from a requirement,
> then write the minimum code to pass it, one requirement at a time.

## Requirements

1. `calculatePoints(purchaseAmount)` returns 1 point per whole dollar spent
   (e.g., $42.90 -> 42 points).
2. Purchases of $100 or more earn a 10% point bonus, rounded down
   (e.g., $150 -> 150 base points + 15 bonus = 165 points).
3. A negative or zero purchase amount throws an `InvalidPurchaseError`.
4. `calculatePoints` never returns a negative number of points.
5. Points always round down to the nearest whole point (no fractional
   points awarded).

## Files to create during the exercise

- `loyaltyCalculator.js` (implementation - does not exist yet)
- `loyaltyCalculator.test.js` (tests - drive this first, per requirement)
