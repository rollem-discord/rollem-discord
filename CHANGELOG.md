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
