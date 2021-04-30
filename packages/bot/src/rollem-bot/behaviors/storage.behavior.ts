import { RollBehaviorBase } from "./roll-behavior-base";
import { Parsers } from "@bot/lib/parsers";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Config } from "@bot/config";
import { Injectable } from "injection-js";
import { RepliedMessageCache } from "@bot/lib/replied-message-cache";
import { Storage } from "@rollem/common";

/**
 * Replies with storage inspection commands.
 */
@Injectable()
export class StorageBehavior extends RollBehaviorBase {
  constructor(
    parsers: Parsers,
    config: Config,
    storage: Storage,
    repliedMessageCache: RepliedMessageCache,
    client: Client,
    logger: Logger,
  ) { super(parsers, config, storage, repliedMessageCache, client, logger); }

  protected async register() {
    this.client.on('message', async message => {
      if (message.author.bot) { return; }
      if (message.author == this.client.user) { return; }
      if (this.repliedMessageCache.hasSeenMessageBefore(message, "storage")) { return; }
      if (await this.shouldDefer(message)) { return; }

      const user = await this.storage.getOrCreateUser(message.author.id)

      var content = message.content.trim();

      // reply if we were @mentioned or this is a DM
      var inDMs = !message.guild;
      var match = content.match(this.config.mentionRegex);
      if (match) { content = content.substring(match[0].length).trim(); }
      if (match || inDMs) {
        var commands = content.split(/\s+/);
        var i = 0;
        console.log(commands);
        if (commands[i].toLowerCase() !== "storage") { return; }

        switch (commands[++i]) {
          case "dump":
            this.replyAndLog(message, "storage", ["```json", JSON.stringify(user, undefined, " "), "```"]);
            return;

          case "forget":
            await this.storage.forgetUser(message.author.id);
            this.replyAndLog(message, "storage", ["You are forgotten."]);
            return;

          case "":
          default:
            this.replyAndLog(
              message,
              "storage",
              [ `Unrecognized commands:`,
                "```",
                `${commands}`,
                "```",
                "",
                "Format:",
                "```",
                `storage <subcommand>`,
                "```",
                "",
                "`dump` - print everything we know about you",
                "`delete` - delete everything we know about you"]);
            return;
        }
      }
    });
  }
}