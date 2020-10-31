import { RollBehaviorBase } from "./roll-behavior-base";
import { Parsers } from "@bot/lib/parsers";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Config } from "@bot/config";
import { Injectable } from "injection-js";
import { RepliedMessageCache } from "@bot/lib/replied-message-cache";
import { Storage } from "@storage/storage";

/**
 * Parses things with the following prefixes:
 *  - The bot's name
 *  - &
 *  - r
 * 
 * Parses `[inline rolls]`
 */
@Injectable()
export class ParseShortPrefixBehavior extends RollBehaviorBase {
  constructor(
    parsers: Parsers,
    config: Config,
    storage: Storage,
    repliedMessageCache: RepliedMessageCache,
    client: Client,
    logger: Logger,
  ) { super(parsers, config, storage, repliedMessageCache, client, logger); }

  protected async register() {
    // TODO: Combine common bail rules.
    // inline and convenience messaging
    this.client.on('message', async message => {
      // avoid doing absurd things
      if (message.author.bot) { return; }
      if (message.author == this.client.user) { return; }
      if (this.repliedMessageCache.hasSeenMessageBefore(message, "short")) { return; }
      if (await this.shouldDefer(message)) { return; }

      let content = message.content.trim();

      // ignore the dice requirement with prefixed strings
      if (content.startsWith('r') || content.startsWith('&')) {
        let subMessage = content.substring(1);
        let hasPrefix = true;
        let requireDice = false;
        let lines = this.rollMany(message, `Short-prefixed roll (${content[0]})`, subMessage, hasPrefix, requireDice);
        await this.replyAndLog(message, `Short-prefixed roll (${content[0]})`, lines);
      }
    });
  }
}