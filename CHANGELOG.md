# **1.9.4**
* Avoid exceptions when the bot doesn't have send permissions.

# **1.9.3**
* Do not reply to messages with [bracketed] [text] that is not a roll.

# **1.9.2**
* Ensure the bot always displays an accurate version number.

# **1.9.1**
* Fix roll limits for `[XdY inline]`.

# **1.9.0**
* Add `N# XdY` prefix for rolls. Will roll `XdY` N times.
* Adjust new-lining on `[XdY inline]` rolls to have them show up aligned.

# **1.8.0**
* Add `ns` suffix for standard `XdY` rolls. Use `XdYns` to disable sorting for that roll. Ex: `50d6ns`

# **1.7.0**
* Rework the structure of logging.
* Tweak the launch method in the README. Should be easier to develop on. I suggest VSCode.
* Connect logging to Application Insights. Improve logging (including source shard and human readable event type).
* No messages, message IDs, user IDs, Guild IDs, etc are logged.
* Add a heartbeat from each shard. Logs some metrics each hour to confirm the shard is up and connected.

# **1.6.0**
* Make bot deferral mechanism work on a per-channel basis, rather than per-server.

# **1.5.5**
* Embed help links with `<link>` syntax, to avoid embedding URLs.
* Rollem has a dedicated support server/channel now at <https://goo.gl/7qfUtG>.

# **1.5.4**
* Fix bot deferral mechanism - `Rollem` will now properly defer to `Rollem Beta`/`Rollem Dev`, and `Rollem Beta` will defer to `Rollem Dev`.

# **1.5.3**
* Add sharding support. Sharding is required by Discord for bots on >2500 servers.
* Sorry for the downtime.

# **1.5.2**
* Update API version, restoring the missing 'Playing' message.

# **1.5.1**
* Fix Fate notation to allow lowercase `f`.

# **1.5.0**
* Add `++` and `--` operators.

# **1.4.0**
* Add `@rollem changelog` command.

# **1.3.3**
* Fix `rollem:prefix:<your prefix here>` to actually do what it's supposed to. Thanks RPGX!
* Document `rollem:prefix:<your prefix here>`

# **1.3.2**
* Drop server list in `stats` listing.

# **1.3.1**
* Correctly sort die values numerically, not lexicographically. gg js.

# **1.3.0**
* Add syntax for Burning Wheel Open Rolls `BX!` `GX!` `WX!` - aliased to `Xd6! >> Y` for Y in 2,3,4.

# **1.2.1**
* Set depth on `dF` to 2, allowing non-explicit `dF` rolls.

# **1.2.0**
* Add syntax for Fate Dice `dF` `XdF` - rolls dice with values of -1, 0, and 1.

# **1.1.0**
* Add syntax for Burning Wheel `BX` `GX` `WX` - aliased to `Xd6 >> Y` for Y in 2,3,4.
* Refactor rollem.pegjs to allow use of operations within other operations.

# **1.0.1**
## Add
* Ability to defer to other bots.
* Beta channel.
* Dev channel.

# **1.0.0**
## Add
* Dice. `XdY` `dY`
* Exploding dice. `dY!` `XdY!`
* Target Number pass/fail. `A<B` `A>=B`
* Pass/fail counting. `A<<B` `A>>B`
* Math. `A+B` `A-B` `A*B` `A/B` `(E)`
* Note-able roles. `4d3 fire damage`
* Inline rolling via `[4d3 for glory]`
* Force math via `&1+1` or `r1+1`
* `@rollem stats`
* Set prefix by giving rollem the role `rollem:prefix:<your prefix here>`
* Some restrictions:
  * Inline rolls must involve dice.
  * No more than 100 dice per line.
  * One-sided dice do not exist.
