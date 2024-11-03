---
title: Terms of Service
layout: home

# Basing it off this https://gist.github.com/anshulxyz/78a886fd2b0766d1538e9cbdda626a26
# and this https://www.athixbot.xyz/terms
# and this https://discord.com/terms
# and this https://drewdevault.com/2021/06/14/Provided-as-is-without-warranty.html
# a lot of the others had a sea of legalese, and I'm not super into that unless I really have to.
---

# Terms of Service
Last updated November 2nd, 2024.

## Context
Just so it's clear what we're talking about

### Some Definitions
- **Rollem** generally refers to the Discord bot hosted by us, whether that's `@rollem`, `@rollem-next`, or a temporary instance like `@rollem-dev`.

### Scope
This Terms of Service only refers to things that we control or operate. Forks of Rollem, self-hosted instances of the Rollem code, or things that look like Rollem (but aren't) should be discussed with their owners.

Here are some of the things we operate:

- Online: [rollem.rocks website][rollem-on-web]
- On Discord: [Rollem Support][support-server] server and all the Rollem bots within it
  - `@rollem #7705` with user id `240732567744151553`
  - `@rollem-next #6080` with user id `840409146738475028`
  - `@rollem-dev #4833` with user id `243615627581980672`
- On Mastodon: [@rollem @botsin.space][rollem-on-mastodon]
- On Github: [rollem-discord][github]
- On NPM: [@rollem Organization][rollem-on-npm]
- On Docker Hub: [Rollem user][rollem-on-dockerhub]
  - [Mirrored to Github Packages Registry][rollem-on-github-packages]

---

## General Statements

### Intended Use
Rollem was created to be used as a convenient dice bot for Tabletop Role Playing Games (TTRPGs) and other low-stakes games of chance. The general expectation in such an environment is that it's a friendly social game, made somewhat more interesting by some randomization via The Dice Gods™.

Anything where the randomness Absolutely Must Be Guaranteed should not use Rollem. Even though the randomness is probably better than dice, we don't make much of an effort to resist determined attackers. Read more [in the FAQ][faq-cheating].

### Misuse & Etiquette
Don't use Rollem to cause issues. We're all just here to have a fun time.
- Don't try to cheat Rollem.
- Don't *ask us* to add Rollem cheats for you.
- Don't try and crash Rollem for other users.
- Don't use Rollem to spam global chat.
- Don't put Rollem on a Bot spam server.

Please report any issues [on Github][github-issues] or [the Support Server][support-server].

### **Prohibited** Use
Generally, do what you want with Rollem. It's not our concern, but The Law has other ideas.

Specifically, do not use Rollem for gambling.
- In Washington State, where I am based, it is [extremely illegal][legal-wa-gambling] when "something of value" is on the line.
- In California, where Rollem is hosted, it is [somewhat less illegal][legal-ca-gambling], but still not legal.
  - Discord is also [subject to California law][discord-tos], so it should probably be avoided on the platform.
- Beyond such prohibitions, legal handling of online gambling requires the navigation of [many, many laws][gambling-law-general] and [certifications, such as that offered by random.org][gambling-law-cert], which is well-beyond the scope of Rollem.
- Ignoring legality, it should be avoided because very little effort has been made to avoid [the many attacks against RNGs][gambling-law-attacks].

### External Terms of Service
Rollem operates on top of other services. As such, you'll need to follow the relevant external ToS while using it.

For example:
- [Discord ToS][discord-tos] when using it from discord
- [mastodon.social ToS][mastodon-tos] when using it from mastodon.social instance
- Any relevant terms for your servers / instances / etc.

---

## Bot Operations
Rollem's basic behavior is to
1. Receive text from a service (Discord, etc)
2. Parse that text
3. Determine if it is intended to respond
4. Responds with some formatted random numbers

### Processing of Data
In order to fulfill its role, Rollem processes messages made available to it. Some of these may be stored temporarily to facilitate maintenance. For more details on what data is stored, for what purpose, and for how long, refer to the [Privacy Policy][privacy-policy].

**Within Discord**, this generally means every message sent in channels Rollem can see.  
To prevent processing of messages, the Server Owner and Moderators may limit Rollem's access to channels, such as thru the "Read Text Channels" permission. [Read more about Discord Permissions here][discord-permission-management]

**Within Mastodon**, this generally means (1) Messages that mention the `@rollem` user, and (2) Messages by users that follow `@rollem` (so long as [the post is visible][mastodon-post-visibility]). To prevent processing of posts, avoid mentioning the `@rollem` user, or unfollow `@rollem`.


### Retained Data
Rollem may store some data you have requested Rollem store to facilitate gaming.  
This information is stored as per [Rollem's Privacy Policy][privacy-policy].

We try our best to keep the data you've asked of us, but we can't guarantee it will stay there. Data may be lost, or deleted to maintain the service.

You can view and remove any stored information on [your account page][account].

### Distribution
Due to scale, rollem is heavily [sharded][discord-sharding-official]. At time of writing there are roughly 150 Rollem instances servicing roughly 350,000 Discord Servers.

As a result, sometimes one shard will fail while the others are fine. Rollem may then appear offline in one server, while online in another. If this occurs and it doesn't come back on its own, please report it in [the Support Server][support-server].

### Support, Feature Requests, and Issue Reporting
Support, issues, and ad-hoc feature requests are handled in [the Support Server][support-server].

Feature tracking is handled [through Github][github-issues].

---

## Source Code & Contributing
### License
Should you wish to host your own instance of Rollem, the source code is available under the MIT license [on Github][github-license].
> MIT License
> 
> Copyright (c) 2016 David Sharer
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

### Contributing
We're open to Pull Requests [on Github][github], but cannot promise every PR will be accepted. You're also welcome to fork the bot. Discussion generally happens in dedicated channels on [the Discord Support Server][support-server].

---

## Misc

### Service 'AS IS' & Limitation of Liability
As with the source code, the Rollem live services are provided "AS IS", greatest extent permissible by law. Similarly, our liability in offering Rollem as a service is limited to the greatest extent permissible by law. Rollem is offered on a "best effort" basis by few developers. We're doing our best, but that doesn't mean we always succeed.

(The Discord Terms of Service have a gigantic pile of ALL CAPS LEGALESE about "Limitation of liability" -- but including something like that here seems excessive and likely to be somehow incorrect)

### Updates to Terms of Service
These terms may change. Notice will be given in [the Support Server][support-server]. The history can be viewed [on Github][github-tos].

### Termination
You may stop using Rollem at any time by removing it from your server. Data will be retained according to the [Privacy Policy][privacy-policy]. If Rollem is no longer receiving messages from you, no further information will be processed or retained. See [Processing of Data][processing-of-data] for more details. Any information that may be retained may be deleted through your [Account Page][account]. Feel free to contact us on [the Support Server][support-server].

We may restrict the usage of Rollem by some Servers or Users for any reason. (We have not done this yet)

### Discontinuation
Rollem may not be around forever. We'll try to give you some notice if it's planned to shut down.





[discord-tos]: https://discord.com/terms
[mastodon-tos]: https://mastodon.social/terms
[privacy-policy]: /privacy-policy
[discord-permission-management]: https://discord.com/community/permissions-on-discord-discord#title-5
[discord-sharding-official]: https://discord.com/developers/docs/events/gateway#sharding
[mastodon-post-visibility]: https://docs.joinmastodon.org/user/posting/#privacy

[github-license]: https://github.com/rollem-discord/rollem-discord/blob/main/LICENSE
[github-issues]: https://github.com/rollem-discord/rollem-discord/issues
[github]: https://github.com/rollem-discord/rollem-discord
[github-tos]: https://github.com/rollem-discord/rollem-discord/blob/main/packages/ui/markdown/tos.md

[legal-wa-gambling]: https://wsgc.wa.gov/online-gambling-faq
[legal-ca-gambling]: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=330
[gambling-law-general]: https://en.wikipedia.org/wiki/Online_gambling#Legal_status
[gambling-law-cert]: https://www.random.org/faq/#Q2.2
[gambling-law-attacks]: https://en.wikipedia.org/wiki/Random_number_generator_attack

[account]: /account
[support-server]: /get-support
[processing-of-data]: #processing-of-data
[faq-cheating]: /docs/faq/cheating

[rollem-on-web]: https://rollem.rocks
[rollem-on-mastodon]: https://botsin.space/@rollem
[rollem-on-discord-prime]: #TODO
[rollem-on-discord-next]: #TODO
[rollem-on-npm]: https://www.npmjs.com/org/rollem
[rollem-on-dockerhub]: https://hub.docker.com/u/rollem
[rollem-on-github-packages]: https://github.com/orgs/rollem-discord/packages