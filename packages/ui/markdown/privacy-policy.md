---
title: Privacy Policy
layout: home
notes-from-discord: |
  Privacy Policy Expectations

  We expect that a basic privacy policy would at minimum include the following:

  1) What data do you collect, including but not limited to personal identifying information?
  2) Why do you need the data?
  3) How do you use the data?
  4) Other than Discord the company and users of your own bot on Discord the platform, who do you share your collected data with, if anyone?
  5) How can users contact you if they have concerns about your bot?
  6) If you store data, how can users have that data removed?

  If you do not store data, you still need a privacy policy, even if that policy says "We do not store data" before still providing users with a way to contact you about their concerns.

  We do not have any specific expectations with regard to how you make your privacy policy available. We simply expect that you do your best to make it available to your users however you see fit. This can be a link to a website, a command in your bot, a link to a Pastebin, the option for users to request it via DM, or pretty much anything that empowers users to go find your policy if they should want it. 

  Will this cover every legal obligation you may or may not have as a software developer working with user information at scale? We can't really speak to this, and if you are concerned about your legal obligations regarding GDPR, CCPA, and other regional data regulations, we would advise speaking with a lawyer. Would this cover our expectations for you as a user of our API? Yes.
---

# Rollem Privacy Policy

## What data do we collect? Why do we need it? How do we use it?
This is an overview of the information Rollem collects.  
All information is stored encrypted in-transit and at rest.

Related Privacy Policies:
- [Discord's Privacy Policy][discord-pp]
- [Application Insights' Privacy Policy][ai-pp]
- [Digital Ocean's Privacy Policy][do-pp]

### Information that is stored temporarily
The following data is *sometimes* stored in Microsoft Azure's Application Insights for 7-30 days.
This is a logging service used for diagnostics on live websites and services.
You may read more about [Azure's Application Insights privacy policy here](ai-pp)
The exact data that is stored depends on what issues are actively being debugged.
It is used solely for diagnostics.

This is a list of what may be temporarily stored, at most. In rough order of likelihood:
- Time of the log message
- Shard ID of a given message, to verify shard activity
- Guild ID of a given message, to identify problem guilds
- Some information about what Rollem was trying to do at the time. "roll some dice", "\[inline rolling\]", etc
- Very rarely! (Application Insights is quite expensive!)
  - Some message content from messages Rollem processes (when there is an issue with the parser handling messages that are not rolls or commands)
  - Author ID, to identify problem users
  - Channel ID, to identify problem channels

### Information that is stored indefinitely
The following data is stored in [a PostgreSQL database managed by Digital Ocean][do-managed-db] until you delete it.
Access is restricted by IP to the applications that connect to the database and a few authorized developers.
You may [read Digital Ocean's Privacy Policy here][do-pp].

Some of the information may eventually be deleted to clean up inactive accounts and free up space.
Active users' data will never be deleted without warning.
- Your Discord ID
- An internal ID, mapped from your Discord ID
- The first date we created a database entry for you
- The last date we modified any database entry for you
- User Settings (view from [your account page][account])

### Potential storage in the future
Future plans for Rollem include some opt-in data storage.
- Any information or settings visible on the website and through the bot, including:
  - Notes
  - Character Information
  - Per-user Rollem Settings
  - Per-channel Rollem Settings
  - Per-guild Rollem Settings

## Who has access?
- This is Temporary#0001 (Me, the bot author)
- H1N1theI#8526 (Does server operations tasks sometimes)
- RowenStipe#4242 (Does server operations tasks sometimes)

## Where should concerns/issues be reported?
- [Join the Support Server][support-server] and
  - Leave a message in #issues or #general-support
  - DM me with any concerns privately
- Open a ticket [on github][github-issues]
- Email me at rollem at davidsharer.com
- DM or tweet at me [on twitter][twitter]

## How to delete your data?
- **Option 1:** [Visit your account page][account] and follow the steps.  
- **Option 2a:** Use the command `@rollem storage forget` in any channel with Rollem active.  
- **Option 2b:** Use the command `storage forget` in a DM with Rollem.  
- **Option 3:** Contact me using one of the methods above.

[support-server]: https://discord.gg/FyMcZSPNFg
[twitter]: https://twitter.com/david_does
[github-issues]: https://github.com/rollem-discord/rollem-discord/issues
[account]: /account
[ai-pp]: https://docs.microsoft.com/en-us/azure/azure-monitor/app/data-retention-privacy#how-secure-is-my-data
[do-pp]: https://www.digitalocean.com/legal/privacy-policy/
[do-managed-db]: https://www.digitalocean.com/products/managed-databases/
[discord-pp]: https://discord.com/privacy