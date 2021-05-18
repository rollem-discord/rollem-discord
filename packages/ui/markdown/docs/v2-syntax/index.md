---
title: V2 Syntax (WIP)
nav_order: 200
---

# V2 Syntax (WIP)

The v2 dice syntax is in the works.

Planned support for:
- All v1 features
- Full Testing Suite
  - this will make it safer to add new features
- delayed evaluation
  - separate parsing from evaluation of the roll
  - this enables testing
  - this allows multiple randomness sources to be used
  - this allows configuration values to be used
  - we can avoid doing the "parsing" phase on every message and just do the roll
- configuration context
  - no-sort as default
  - per-channel + per-guild settings
  - per-user: per-channel + per-guild settings
  - quirky dice options
    - arbitrary array of options
    - emoji
    - number aliasing (+/-/0 = 1/-1/0)
  - quirky randomness source options
    - weight the dice high
    - weight the dice low
    - "fair" (ensure no long-runs of high or low rolls)
  - built-in and user defined variables
    - active character sheet (set of variables)
    - evaluated aliases (so you calculate your CHA modifier based on your CHA score)
    - aliased rolls
  - built-in and user-defined functions
    - calculate min value for a roll `min(roll)`
    - calculate max value for a roll `max(roll)`
    - calculate expected value `ev(roll)`
    - aliases with parameters
- new randomness source
  - switch to seed-able PRNG or [CSPRNG](https://www.npmjs.com/package/secure-random) instead of [node's built-in](https://v8.dev/blog/math-random). Node's built-in is fine but doesn't support seeds.
  - re-seed every few minutes with a new [true random](https://random.org) value
- reported randomness
  - report on which values were selected for which rolls
  - (graphs on the website)
  - (reports per-user?)