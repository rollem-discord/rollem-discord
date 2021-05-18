---
title: Cheating? No.
---

# Q: Is it possible to cheat with Rollem?

To the best of my knowledge: No.

It is not possible to convince Rollem to roll higher/lower die values for you. However, as with all [PRNGs][PRNG], if you can figure out the internal state it's possible to predict future numbers. As of Late May 2021, Rollem is using a [CSPRNG][CSPRNG], which makes predicting values extremely difficult (and the topic of active research in the security field).

Prior to Late May 2021, Rollem used [Node's PRNG][PRNG-NODE] which, while [probably more random][PRNG-VS-DICE] than [actual dice][PRNG-VS-DICE-2], is [not resistant][PRNG-NODE-BREAK-1] to a [determined attacker][PRNG-NODE-BREAK-2].

[Here is the line in Rollem's parser that rolls the dice.][GITHUB-roll]

[PRNG]: https://en.wikipedia.org/wiki/Pseudorandom_number_generator "Wikipedia on Pseudo-Random Number Generators (PRNG)"
[PRNG-VS-DICE]: https://rpg.stackexchange.com/questions/7152/how-reliable-are-dice-rolling-programs "Decent PRNGs are probably more random than dice"
[PRNG-VS-DICE-2]: https://www.forbes.com/sites/davidewalt/2012/09/06/dice-chessex-gamescience-roll-randomn/?sh=30007f46e5d3 "I doubt these dice would pass the tests PRNGs go through"
[PRNG-NODE]: https://v8.dev/blog/math-random "Node's PRNG is xorshift128+"
[PRNG-NODE-BREAK-1]: https://security.stackexchange.com/questions/84906/predicting-math-random-numbers/123554#123554 "Stack Exchange post about predicting the results of Node's Math.random"
[PRNG-NODE-BREAK-2]: https://www.youtube.com/watch?v=_Iv6fBrcbAM "Lecture on the topic of predicting the results of Math.Floor(CONST*Math.random())+CONST"

[GITHUB-language]: https://github.com/rollem-discord/rollem-discord#language-development "How to test the language"
[GITHUB-roll]: https://github.com/rollem-discord/rollem-discord/blob/f4d1cb4ae319728080e9b7dd8bfce331f6ad0b24/packages/language/src/rollem-language-1/rollem-header.ts#L30 "The line in Rollem that does the rolling"

[CSPRNG]: https://en.wikipedia.org/wiki/Cryptographically-secure_pseudorandom_number_generator "Cryptographically-Secure Pseudo-Random Number Generators"