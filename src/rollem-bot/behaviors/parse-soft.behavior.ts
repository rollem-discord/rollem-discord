import { RollBehaviorBase } from "./roll-behavior-base";
import { RollemParser } from "@language/rollem";
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
    parser: RollemParser,
    config: Config,
    client: Client,
    logger: Logger,
  ) { super(parser, config, client, logger); }
  
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
    
      let count = 1;
      let match = content.match(/(?:(\d+)#\s*)?(.*)/);
      let countRaw = match ? match[1] : false;
      if (countRaw) {
        count = parseInt(countRaw);
        if (count > 100) { return; }
        if (count < 1) { return; }
      }
    
      count = count || 1;
      let contentAfterCount = match ? match[2] : content;
    
      var lines: string[] = [];
      for (let i = 0; i < count; i++) {
        var result = this.parser.tryParse(contentAfterCount);
        if (!result) { return; }
    
        let shouldReply = prefix || (result.depth > 1 && result.dice > 0); // don't be too aggressive with the replies
        if (!shouldReply) { return; }
    
        let response = this.buildMessage(result);
    
        if (response && shouldReply) {
          lines.push(response);
        }
      }
    
      if (lines.length > 0) {
        let response = "\n" + lines.join("\n");
        message.reply(response).catch(rejected => this.handleSendRejection(message));
    
        if (count === 1) { this.logger.trackEvent('soft parse'); }
        else { this.logger.trackEvent('soft parse, repeated'); }
    
        return;
      }
    });
  }
}