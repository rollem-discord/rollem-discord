import { RollBehaviorBase } from "./roll-behavior-base";
import { Parsers } from "@bot/lib/parsers";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Config } from "@bot/config";
import { Injectable } from "injection-js";
import { RepliedMessageCache } from "@bot/lib/replied-message-cache";
import { Storage } from "@rollem/common";

/**
 * Parses things with the following prefixes:
 *  - The bot's name
 *  - &
 *  - r
 * 
 * Parses `[inline rolls]`
 */
@Injectable()
export class ParseNamePrefixedBehavior extends RollBehaviorBase {
  constructor(
    parsers: Parsers,
    config: Config,
    storage: Storage,
    repliedMessageCache: RepliedMessageCache,
    client: Client,
    logger: Logger,
  ) { super(parsers, config, storage, repliedMessageCache, client, logger); }

  protected async register() {
    // TODO: Split this up. Combine common bail rules.
    // inline and convenience messaging
    this.client.on('message', async message => {
      // avoid doing absurd things
      if (message.author.bot) { return; }
      if (this.repliedMessageCache.hasSeenMessageBefore(message, "prefixed")) { return; }
      if (message.author == this.client.user) { return; }

      var content = message.content.trim();

      // ignore the dice requirement with name prefixed strings
      var match = content.match(this.config.mentionRegex);
      if (match) {
        var subMessage = content.substring(match[0].length);
        let hasPrefix = true;
        let requireDice = false;
        var lines = this.rollMany(message, "Name-prefixed roll", subMessage, hasPrefix, requireDice);
        var replied = await this.replyAndLog(message, 'Name-prefixed roll', lines);
      }
    });
  }
}