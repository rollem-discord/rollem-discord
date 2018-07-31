# Rollem for Discord

A feature-filled dicebot that allows you to just roll.

[Add this bot to your server.](https://discordapp.com/oauth2/authorize?client_id=240732567744151553&scope=bot&permissions=0)

[View the change log.](CHANGELOG.md) (or type `@rollem changelog` in chat)

## Beta Channel

Changes will be vetted in the beta channel before being moved to the main bot.

It is recommended to also have the main bot on your server. The beta bot will only be online while changes are being vetted.

If both exist, the main bot will defer to the beta bot. This is per-channel.

[Add the beta bot to your server.](https://discordapp.com/oauth2/authorize?client_id=263621237127905280&scope=bot&permissions=0)

## Support and Feature Requests

* [Rollem Support Server](https://discord.gg/VhYX9u7)
* [Issues Tracker](https://github.com/lemtzas/rollem-discord/issues)
* [@Lemtzas on Twitter](https://twitter.com/lemtzas)

# How to use this bot

Just roll.

> **@you:** 4d6  
> **@rollem:** @you, 17 ⟵ [6, 5, 3, 3]4d6

> **@you:** 4d6 for glory  
> **@rollem:** @you, 'for glory', 17 ⟵ [6, 5, 3, 3]4d6

Inline rolls.

> **@you:** Rolling [4d6] for glory  
> **@rollem:** @you, 17 ⟵ [**6**, 5, 3, 3]4d6

> **@you:** Rolling [4d6 for glory]  
> **@rollem:** @you, 'for glory', 17 ⟵ [**6**, 5, 3, 3]4d6

Repeated rolls.

> **@you:** 3#d20  
> **@rollem:** @you,  
> 20 ⟵ [**20**]1d20  
> 13 ⟵ [13]1d20  
> 11 ⟵ [11]1d20

Stat generation.

> **@you:** 6#4d6d1  
> **@rollem:** @you,  
> 12 ⟵ [**6**, 3, 3, ~~2~~]4d6dl1  
> 6 ⟵ [2, 2, 2, ~~**1**~~]4d6dl1  
> 13 ⟵ [5, 5, 3, ~~2~~]4d6dl1  
> 10 ⟵ [5, 3, 2, ~~2~~]4d6dl1  
> 13 ⟵ [**6**, 5, 2, ~~**1**~~]4d6dl1  
> 15 ⟵ [**6**, **6**, 3, ~~3~~]4d6dl1

Math.

> **@you:** &50+50  
> **@rollem:** @you, 100 ⟵ 50 + 50

> **@you:** r50+50  
> **@rollem:** @you, 100 ⟵ 50 + 50

## Dice Syntax

X/Y/Z are integers. A and B are arbitrary Expressions.

| Syntax            |                                                                                                                                                          |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `XdY`             | Rolls X dice of Y size. `4d6` rolls 4 six-sided dice.                                                                                                    |
| `dY`              | Rolls a single die of Y size.                                                                                                                            |
| `dY!` `XdY!`      | Exploding dice. Rolly Y on a Y-sided die grants an additional die roll.                                                                                  |
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

## Limitations
* Rollem will not roll more than 100 dice.
* Rollem will not roll "one-sided" dice.
* Rollem will not roll single numbers.
* Pure math must be prefixed with `&` (can be changed per server).
* Rolls prefixed with `N#` will be rolled `N` times. N > 100 will be ignored.

## Prefixing
Give Rollem a role of `rollem:prefix:<your prefix here>` to disable no-prefix rolling.

With this role:
* Rollem will still roll lines prefixed with `&` (can be changed per server).
* Rollem will still roll lines addressed to him. `@Rollem 2d20`
* Rollem will still roll inline syntax `swing the sword [2d20 for justice]`
* Rollem with not aggressively parse lines `2d20 for justice`
* Rollem will aggressively parse lines prefixed with `<your prefix here>`

## Commands

All commands are performed by mentioning `@rollem` in server chat, and without prefix in private chat.

| Command                                      | Example             | Purpose                                 |
|----------------------------------------------|---------------------|-----------------------------------------|
| `stats`, `help`                              | `@rollem stats`     | Dump stats, uptime and credit.          |
| `changelog`, `changes`, `change log`, `diff` | `@rollem changelog` | View the most recent changelog entries. |
| `set prefix, noSort, or adminRole`           | `&set prefix &`     | Change per server settings, such as prefix |

# Development

## Single Shard development
### From the command line
1. Rename and update `./sample-source.env` (DO NOT COMMIT THIS)
2. `source source.env && node bot.js`
  * You will need to replace `YOUR_TOKEN_HERE` with an app bot user token from [discord's applications page](https://discordapp.com/developers/applications/me)
  * The Application Insights line should be deleted to switch to console-logging.

### From VSCode (with debugging)
1. Rename and update `./sample-vscode.env` (DO NOT COMMIT THIS)
2. Press F5 while the project folder is open. Launch configuration is in `./.vscode/launch.json`

## Multiple Shards
1. Rename and update `./sample-source.env` (DO NOT COMMIT THIS)
2. Run `source source.env && yarn start`
  * You will need to replace `YOUR_TOKEN_HERE` with an app bot user token from [discord's applications page](https://discordapp.com/developers/applications/me)
  * The Application Insights line should be deleted to switch to console-logging.

Unfortunately `discord.js` does not yet support debugging multiple shards.

## ~~Vagrant and Docker Setup (old)~~

1. Setup [Vagrant](https://www.vagrantup.com/) with `vagrant up`
2. `vagrant ssh` to get into it.
3. Code will be in `/vagrant`.
4. From `/vagrant`, run `docker build -t rollem . && docker run -it --rm -e DISCORD_BOT_USER_TOKEN='<YOUR TOKEN>' --name rollem rollem`
    * You will need to replace `<YOUR TOKEN>` with an app bot user token from [discord's applications page](https://discordapp.com/developers/applications/me)

## Deploying the Bot

* [rollem-discord on docker hub](https://hub.docker.com/r/lemtzas/rollem-discord/).
* Set the `DISCORD_BOT_USER_TOKEN` environment variable to your token from [discord's applications page](https://discordapp.com/developers/applications/me).
* The docker hub will automatically update with the latest commits on `master`.

## Publishing

* Bump the version number. Follow [semver](http://semver.org/).
* `npm publish`

## Using rollem.js as a library

* npm install rollem-discord
* `const Rollem = require ('rollem-discord');`
* `var result = Rollem.tryParse(text)` (or `Rollem.parse(text)` to get the errors from valid rolls)

* If `text` did not look like a valid roll, `result === null`.
* If `text` looked like a roll, but was illegal. `typeof(result) === "string"`, where the value is the error message.
* If `text` was a valid roll, `typeof(result) === "object"` and follows this format:


```js
{
  "value": 27,
  "values": [ value1, value2, value3 ],
  "pretties": "[value1, value2, **value3**]",
  "label": "Anything you want",
  "depth": 5,
  "dice": 7
}
```

Breakdown:

| Field      |                                                                                                                                                                                 |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `value`    | The final value. Usually a number. Will be `boolean` if the last statement was of the type `x < y`. If dice were involved, it will be the collapsed result of summing `values`. |
| `values`   | The most recent array of results. `2d2 * 2` will result in an array of length 2 with values of either 2 or 4. Probably not useful.                                              |
| `pretties` | The pretty-printed result. Markdown-compatible. Designed for use with discord. Min/max values are **bolded**.                                                                   |
| `depth`    | The depth of the operations. Ex: `5` is 1. `5+5` is 2. `d5` is 2. `(d5+7)*3` is 4. Use this to avoid matching on `5`.                                                           |
| `label`    | Any junk text that was passed after the parsed text. Ex: `5 And Some Junk` has `And Some Junk` for this value.                                                                  |
| `dice`     | The total number of dice used for this roll. Does not include explosions.                                                                                                       |

## Some useful links

* [language-pegjs for atom](https://github.com/atom/language-pegjs)  
* [pegjs online](http://pegjs.org/online)
* [pegjs documentation](http://pegjs.org/documentation)
* [discord.js](https://github.com/hydrabolt/discord.js/)
* [discord.js docs](http://discord.js.org/#!/docs/tag/master)
* [discord API docs](https://discordapp.com/developers/docs/intro)

## Some useful commands

**Change image:**

```sh
curl --request PATCH --header "Authorization: Bot {TOKEN HERE}" -H "Content-Type: application/json" --data '{ "avatar": "{BASE-64 HTML EMBED HERE}" }' https://discordapp.com/api/users/@me
```

```sh
(echo -n '{ "avatar":"'; base64 -w 0 {FILENAME HERE}; echo '" }') | curl --request PATCH --header "Authorization: Bot {TOKEN HERE}" -H "Content-Type: application/json" -d @- https://discordapp.com/api/users/@me
```

# Credits

Avatar by Kagura on Charisma Bonus.

![](avatar/kagura1.jpg)

# License: MIT

Copyright (c) 2018 Lemtzas

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
