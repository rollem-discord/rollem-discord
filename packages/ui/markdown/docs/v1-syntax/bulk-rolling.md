---
layout: default
title: Bulk Rolling
parent: Syntax
nav_order: 4
---

# Bulk Rolling

Can be used for generating stats. 4d6 Drop Lowest is common in some D&D-type games.

![](/assets/stat-generation.png)

| Syntax            |                                                                                                                                                          |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `X#A`             | Evaluates the expression A X times. Use for stat generation: `6#4d6d1`                                                                                   |
| `ore#A`           | Groups results of the expression A as by [the One-Roll Engine (ORE)][ORE], indicating success level `ore#10d10`                                          |
| `fortune#A`       | Groups results of the expression A as by the Fortune system, indicating success level `fortune#10d10`                                                    |
| `group#A` `groupValue#A` `groupHeight#A` | Groups results of the expression A, ordering the groups by die value `group#10d10`                                                |
| `groupCount#A` `groupSize#A` `groupWidth#A` | Groups results of the expression A, ordering the groups by group size `groupCount#10d10`                                       |


[ORE]: https://en.wikipedia.org/wiki/One-Roll_Engine