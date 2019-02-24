Rollem is a feature-filled dicebot that allows you to just roll.

After using many dice bots, I found them wanting.
- Many dicebots require roll prefixing - as in /roll 1d20
- Rolls must be rolled on their own line, bloating the chat logs.
- Many dicebots support *very* limited syntax. Such as only XdY and XdY+Z. This is a non-starter for many systems.
- Many dicebots that support more complex syntax have lengthy, mind-numbing documentation for a wide array of features you won't use.
- Many dicebots are written with a very specific system in mind.

And so I made Rollem.
- Rollem rolls with no prefix. If it looks like a roll, it rolls.
- Rollem rolls inline. Rolls may be tagged to label them. Ex: "3d6+2d8 for damage", or "I roll [1d20 to hit] and [2d6 for damage]"
- Rollem supports [an array of complex syntax](http://rollem.rocks), including keep-drop dice, Fate dice, and Burning Wheel dice notation. 
- Rollem aims to be minimal.
- Rollem aims to be system-agnostic. If it doesn't work for your system, please ask!

## Key Links
- [Documentation is at rollem.rocks](http://rollem.rocks/)
- [Support is on Discord](https://discord.gg/cz7mVBa)
- [Add the main bot](https://discordapp.com/oauth2/authorize?client_id=240732567744151553&scope=bot&permissions=0)
- [Add the beta bot](https://discordapp.com/oauth2/authorize?client_id=263621237127905280&scope=bot&permissions=0) (also add the main bot)

## Briefly...
The first version of Rollem was cobbled together for IRC and run locally. While it saw some popularity, the nature of IRC had it common among only a few groups. Those groups moved to Discord. And so Rollem did as well. Rollem was rewritten for Discord - in JavaScript instead of Ruby - and with an actual dice parser, allowing for some more exciting features.

​Back when Rollem was on IRC, it happily ran on a Raspberry Pi. Rollem is now on over 3,000 servers with nearly 30,000 users.

That requires some infrastructure. That's where you come in.