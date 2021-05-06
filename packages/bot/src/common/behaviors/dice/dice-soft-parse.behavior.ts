import { Config } from "@bot/config";
import { Parsers } from "@bot/lib/parsers";
import { Logger } from "@bot/logger";
import { BehaviorContext } from "@common/behavior-context";
import { BehaviorResponse } from "@common/behavior-response";
import { Trigger } from "@common/behavior.base";
import { Injectable } from "injection-js";
import _ from "lodash";
import { DiceBehaviorBase } from "./dice.behavior.base";

/**
 * Parses messages that do not mention the bot.
 */
@Injectable()
export class DiceSoftParseBehavior extends DiceBehaviorBase {
  public label = 'dice-soft-parse';

  constructor(parsers: Parsers, config: Config, logger: Logger) { super(parsers, config, logger); }

  public async onTaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return null;
  }

  public async onUntaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
     // apparently D8 is a common emote, so avoid responding to that
    if (content.startsWith('D')) { return null; }

    const requireDice = true;
    const lines = this.rollMany(content, this.label, content, context, requireDice);
    return await this.makeReplyAndLog(content, this.label, lines);
  }
}