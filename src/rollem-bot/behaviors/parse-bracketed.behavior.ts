import { RollBehaviorBase } from "./roll-behavior-base";
import { Parsers } from "@bot/lib/parsers";
import { Client } from "discord.js";
import { Logger } from "@bot/logger";
import { Config } from "@bot/config";
import { Injectable } from "injection-js";
import _ from "lodash";
import { join } from "path";

/**
 * Parses things with the following prefixes:
 *  - The bot's name
 *  - &
 *  - r
 * 
 * Parses `[inline rolls]`
 */
@Injectable()
export class ParseBracketedBehavior extends RollBehaviorBase {
  constructor(
    parsers: Parsers,
    config: Config,
    client: Client,
    logger: Logger,
  ) { super(parsers, config, client, logger); }

  protected register() {
    // TODO: Combine common bail rules.
    // inline and convenience messaging
    this.client.on('message', message => {
      // avoid doing insane things
      if (message.author.bot) { return; }
      if (message.author == this.client.user) { return; }
      if (this.shouldDefer(message)) { return; }

      let content = message.content.trim();

      // handle inline matches
      let last: RegExpExecArray | null = null;
      let matches: string[] = [];
      let regex = /\[(.+?)\]/g;
      while (last = regex.exec(content)) { matches.push(last[1]); }

      if (matches && matches.length > 0) {
        this.logger.trackMessageEvent(`Bracketed Roll (parent): [${matches.join('], [')}]`, message);
        let lines =
          _(matches)
            .map(match => {
              let hasPrefix = true;
              let requireDice = true;
              let lines = this.rollMany(message, "Bracketed Roll", match, hasPrefix, requireDice);
              return lines;
            })
            .filter(x => x != null)
            .map(x => x || [])
            .flatten()
            .value();

        if (lines.length === 0) { return; }
        this.replyAndLog(message, `Bracketed Roll`, lines);
      }
    });
  }
}