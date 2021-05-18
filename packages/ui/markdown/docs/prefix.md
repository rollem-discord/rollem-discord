---
layout: default
title: Prefix
nav_order: 3
has_children: false
permalink: /prefix/
---

# Prefixes

Normally, Rollem does not use a prefix. If it looks like a roll, Rollem will treat it like one.

![](/assets/just-roll.png)

## Prefixing
If you don't want this behavior, give Rollem a role of `rollem:prefix:<your prefix here>` to disable no-prefix rolling.

With this role:
* Rollem will still roll lines prefixed with `&` or `r`
* Rollem will still roll lines addressed to him. `@Rollem 2d20`
* Rollem will still roll inline syntax `swing the sword [2d20 for justice]`
* Rollem with not aggressively parse lines `2d20 for justice`
* Rollem will aggressively parse lines prefixed with `<your prefix here>`