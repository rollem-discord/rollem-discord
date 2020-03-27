---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: About
layout: home
---
# Rollem for Discord
A dice-rolling bot for Discord that lets you Just Roll To Roll.

[Invite to Server](/invite/){: .btn .btn-blue }

Want the latest updates?

[Also get the beta bot](/invite-beta/){: .btn }

This bot is kept running and fast thanks to community help.

[Support on Patreon](https://patreon.com/david_does){: .btn .btn-blue }

# Links

* [Patreon](https://patreon.com/david_does)
* [Rollem Support Server](https://discord.gg/VhYX9u7)
* [Issues Tracker](https://github.com/lemtzas/rollem-discord/issues)

# How to use this bot

Just roll.

![](assets/just-roll.png)

Inline rolls.

![](assets/inline-rolls.png)

Repeated rolls.

![](assets/repeated-rolls.png)

Stat generation.

![](assets/stat-generation.png)

Math.

![](assets/math.png)

Need more? Check out [the syntax](/syntax)

## Limitations
* Rollem will not roll more than 100 dice.
* Rollem will not roll "one-sided" dice.
* Rollem will not roll single numbers.
* Pure math must be prefixed with `&` or `r`.
* Rolls prefixed with `N#` will be rolled `N` times. N > 100 will be ignored.

## Prefixing
Give Rollem a role of `rollem:prefix:<your prefix here>` to disable no-prefix rolling.

With this role:
* Rollem will still roll lines prefixed with `&` or `r`
* Rollem will still roll lines addressed to him. `@Rollem 2d20`
* Rollem will still roll inline syntax `swing the sword [2d20 for justice]`
* Rollem with not aggressively parse lines `2d20 for justice`
* Rollem will aggressively parse lines prefixed with `<your prefix here>`