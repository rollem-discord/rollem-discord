---
layout: default
title: Keep/Drop
parent: Syntax
nav_order: 5
---

# Keep/Drop dice

Drops the specified number of lowest/highest dice.

| Syntax            |                                                                                                         |
|-------------------|---------------------------------------------------------------------------------------------------------|
| `dYdZ` `XdYdZ`    | Drops the *lowest* Z dice from the result of `XdY`. Alias for `XdYdlZ`. May be used with `ns` and `!`.  |
| `dYdlZ` `XdYdlZ`  | Drops the *lowest* Z dice from the result of `XdY`. May be used with `ns` and `!`.                      |
| `dYdhZ` `XdYdhZ`  | Drops the *highest* Z dice from the result of `XdY`. May be used with `ns` and `!`.                     |
| `dYkZ` `XdYkZ`    | Keeps the *highest* Z dice from the result of `XdY`. Alias for `XdYkhZ`. May be used with `ns` and `!`. |
| `dYkhZ` `XdYkhZ`  | Keeps the *highest* Z dice from the result of `XdY`. May be used with `ns` and `!`.                     |
| `dYklZ` `XdYklZ`  | Keeps the *lowest* Z dice from the result of `XdY`. May be used with `ns` and `!`.                      |
|                   | None of these can be used with Critrange notation.                                                      |
