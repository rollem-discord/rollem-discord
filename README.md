# Rollem for Discord

A feature-filled dicebot that allows you to just roll.

[Add this bot to your server.](https://discordapp.com/oauth2/authorize?client_id=240732567744151553&scope=bot&permissions=0)

# How to use this bot

Just roll.

> **@you:** 4d6  
> **@rollem:** @you, 17 ⟵ [6, 5, 3, 3]4d6

> **@you:** 4d6 for glory  
> **@rollem:** @you, 'for glory', 17 ⟵ [6, 5, 3, 3]4d6

## Dice Syntax

X and Y are integers. A and B are arbitrary Expressions.

| Syntax       |                                                                                                                                                          |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `XdY`        | Rolls X dice of Y size. `4d6` rolls 4 six-sided dice.                                                                                                    |
| `dY`         | Rolls a single die of Y size.                                                                                                                            |
| `dY!` `XdY!` | Exploding dice. Rolly Y on a Y-sided die grants an additional die roll.                                                                                  |
| `A+B` `A-B`  | Arbitrary chains of addition and subtraction.                                                                                                            |
| `A*B` `A/B`  | Arbitrary chains of multiplication and division.                                                                                                         |
| `(E)`        | Parenthetic expressions                                                                                                                                  |
| `A<<B`       | Counts the quantity of values in A that are lower than or equal to the value B. `10d6 << 3` counts the number of dice at 3 or below.                     |
| `A>>B`       | Counts the quantity of values in A that are greater than or equal to the value B. `10d6 >>4` counts the number of dice at 4 or above.                    |
| `A<B` `A>=B` | Equality comparison on A and B. Must be the last operator (`(1 < 2) * 5` is invalid, `1 < (2 * 5)` is valid). Supported operators: `<` `<=` `>` `>=` `=` |

## Limitations

* Rollem will not roll more than 100 dice.
* Rollem will not roll "one-sided" dice.

# Reporting Problems and Requesting Features

* [Issues Tracker](https://github.com/lemtzas/rollem-discord/issues)
* [@Lemtzas on Twitter](https://twitter.com/lemtzas)
* @Lemtzas on Discord. I can be found on [Charisma Bonus](https://discord.gg/7wVKcUs).

# Development

## Vagrant and Docker Setup

1. Setup [Vagrant](https://www.vagrantup.com/) with `vagrant up`
2. `vagrant ssh` to get into it.
3. Code will be in `/vagrant`.
4. From `/vagrant`, run `docker build -t rollem . && docker run -it --rm -e DISCORD_BOT_USER_TOKEN='<YOUR TOKEN>' --name rollem rollem`
    * You will need to replace `<YOUR TOKEN>` with an app bot user token from [discord's applications page](https://discordapp.com/developers/applications/me)

## Some useful links

* [language-pegjs](https://github.com/atom/language-pegjs)  
* [pegjs online](http://pegjs.org/online)
* [pegjs documentation](http://pegjs.org/documentation)
* [discord.js](https://github.com/hydrabolt/discord.js/)
* [discord.js docs](http://discord.js.org/#!/docs/tag/master)
* [discord API docs](https://discordapp.com/developers/docs/intro)

## Publishing

* [rollem-discord on docker hub](https://hub.docker.com/r/lemtzas/rollem-discord/).
* Set the `DISCORD_BOT_USER_TOKEN` environment variable to your token from [discord's applications page](https://discordapp.com/developers/applications/me).
* The docker hub will automatically update with the latest commits on `master`.

# License: MIT

Copyright (c) 2016 Lemtzas

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
