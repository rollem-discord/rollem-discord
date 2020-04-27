import { RollBehaviorBase } from "./roll-behavior-base";
import { Parsers } from "@bot/lib/parsers";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Config } from "@bot/config";
import { Injectable } from "injection-js";

/**
 * Parses things without any prefix, unless a prefix is configured via role-name.
 */
@Injectable()
export class ParseSoftBehavior extends RollBehaviorBase {
  constructor(
    parsers: Parsers,
    config: Config,
    client: Client,
    logger: Logger,
  ) { super(parsers, config, client, logger); }
  
  protected register() {
    this.client.on('message', message => {
      // avoid doing insane things
      if (message.author.bot) { return; }
      if (message.author == this.client.user) { return; }
      if (this.shouldDefer(message)) { return; }
      if (message.content.startsWith('D')) { return; } // apparently D8 is a common emote.
    
      // honor the prefix
      let prefix = this.getPrefix(message);
      if (!message.content.startsWith(prefix)) { return; }
    
      // get our actual roll content
      let content = message.content.substring(prefix.length);
      content = content.trim();
      
      let requireDice = true;
      let lines = this.rollMany(message, "No-prefix roll", content, !!prefix, requireDice);
      this.replyAndLog(message, 'No-prefix roll', lines);
    });
  }
}