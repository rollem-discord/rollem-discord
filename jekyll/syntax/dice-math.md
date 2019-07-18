---
layout: default
title: Dice Math
parent: Syntax
nav_order: 4
permalink: /syntax/math/
---

# Dice Math

| Syntax            |                                                                                                                                                          |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `A+B` `A-B`       | Arbitrary chains of addition and subtraction.                                                                                                            |
| `A*B` `A/B`       | Arbitrary chains of multiplication and division.                                                                                                         |
| `A++B` `A--B`     | Arbitrary chains of per-die addition and subtraction. Each value modifies each individual die roll. `4d6--2` rolls 4d6 with 2 subtracted from each.      |
| `(E)`             | Parenthetic expressions                                                                                                                                  |
| `A<<B`            | Counts the quantity of values in A that are lower than or equal to the value B. `10d6 << 3` counts the number of dice at 3 or below.                     |
| `A>>B`            | Counts the quantity of values in A that are greater than or equal to the value B. `10d6 >>4` counts the number of dice at 4 or above.                    |
| `A<B` `A>=B`      | Equality comparison on A and B. Must be the last operator (`(1 < 2) * 5` is invalid, `1 < (2 * 5)` is valid). Supported operators: `<` `<=` `>` `>=` `=` |
| `X#A`             | Evaluates the expression A X times. Use for stat generation: `6#4d6d1`                                                                                   |
