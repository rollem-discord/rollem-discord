---
layout: default
title: Syntax
nav_order: 2
has_children: true
permalink: /syntax/
---

## Dice Syntax

This is the full syntax. Navigate to pages for specific syntax and examples / explanations.

X/Y/Z are integers. A and B are arbitrary Expressions.

| Syntax            |                                                                                                                                                          |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `XdY`             | Rolls X dice of Y size. `4d6` rolls 4 six-sided dice.                                                                                                    |
| `dY`              | Rolls a single die of Y size.                                                                                                                            |
| `dY!` `XdY!`      | Exploding dice. Rolling Y on a Y-sided die grants an additional die roll.                                                                                |
| `XdYns` `XdY!ns`  | Disable dice sorting.                                                                                                                                    |
| `A+B` `A-B`       | Arbitrary chains of addition and subtraction.                                                                                                            |
| `A*B` `A/B`       | Arbitrary chains of multiplication and division.                                                                                                         |
| `A++B` `A--B`     | Arbitrary chains of per-die addition and subtraction. Each value modifies each individual die roll. `4d6--2` rolls 4d6 with 2 subtracted from each.      |
| `(E)`             | Parenthetic expressions                                                                                                                                  |
| `A<<B`            | Counts the quantity of values in A that are lower than or equal to the value B. `10d6 << 3` counts the number of dice at 3 or below.                     |
| `A>>B`            | Counts the quantity of values in A that are greater than or equal to the value B. `10d6 >>4` counts the number of dice at 4 or above.                    |
| `A<B` `A>=B`      | Equality comparison on A and B. Must be the last operator (`(1 < 2) * 5` is invalid, `1 < (2 * 5)` is valid). Supported operators: `<` `<=` `>` `>=` `=` |
| `BX` `GX` `WX`    | Burning Wheel notation. Aliased to `Xd6 >> Y` where Y is determined by B/G/W. B=4, G=3, W=2.                                                             |
| `BX!` `GX!` `WX!` | Burning Wheel open roll notation. Aliased to `Xd6! >> Y` where Y is determined by B/G/W. B=4, G=3, W=2.                                                  |
| `dF` `XdF`        | Fate Dice notation. Rolls dice with values of -1, 0, 1. Represented by `-`, `0`, and `+`.                                                                |
| `XdYns`           | No Sort. Does not sort the result of `XdY` in the output.                                                                                                |
| `X#A`             | Evaluates the expression A X times. Use for stat generation: `6#4d6d1`                                                                                   |
| `dYdZ` `XdYdZ`    | Drop dice notation. Drops the *lowest* Z dice from the result of `XdY`. Alias for `XdYdlZ`. May be used with `ns` and `!`.                               |
| `dYdlZ` `XdYdlZ`  | Drop dice notation. Drops the *lowest* Z dice from the result of `XdY`. May be used with `ns` and `!`.                                                   |
| `dYdhZ` `XdYdhZ`  | Drop dice notation. Drops the *highest* Z dice from the result of `XdY`. May be used with `ns` and `!`.                                                  |
| `dYkZ` `XdYkZ`    | Keep dice notation. Keeps the *highest* Z dice from the result of `XdY`. Alias for `XdYkhZ`. May be used with `ns` and `!`.                              |
| `dYkZ` `XdYkZ`    | Keep dice notation. Keeps the *highest* Z dice from the result of `XdY`. May be used with `ns` and `!`.                                                  |
| `dYklZ` `XdYklZ`  | Keep dice notation. Keeps the *lowest* Z dice from the result of `XdY`. May be used with `ns` and `!`.                                                   |
| `dYcZ` `XdYcZ`    | Critrange notation. Bolds all rolls greater than or equal to Z. Cannot be used with keep or drop notations.                                              |
