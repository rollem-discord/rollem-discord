---
title: Cheating? No.
---

# Q: Is it possible to cheat with Rollem?

To the best of my knowledge: No.

It is not possible to convince Rollem to roll higher/lower die values for you. However, as with all [PRNGs][PRNG], if you can figure out the internal state it's possible to predict future numbers. As of May 2021, Rollem is using a [CSPRNG][CSPRNG], which makes predicting future values from past values extremely difficult (and the topic of active research in the security field)

[Here is the line in Rollem's parser that rolls the dice.][GITHUB-roll]

[PRNG]: https://en.wikipedia.org/wiki/Pseudorandom_number_generator "Wikipedia on Pseudo-Random Number Generators (PRNG)"

[GITHUB-language]: https://github.com/rollem-discord/rollem-discord#language-development "How to test the language"
[GITHUB-roll]: https://github.com/rollem-discord/rollem-discord/blob/15a9f5d6f7ab2d6e16229cd9aff328f57a08f673/packages/language/src/rollem-language-1/rollem-header.ts#L28 "The line in Rollem that does the rolling"

[CSPRNG]: https://en.wikipedia.org/wiki/Cryptographically-secure_pseudorandom_number_generator "Cryptographically-Secure Pseudo-Random Number Generators"