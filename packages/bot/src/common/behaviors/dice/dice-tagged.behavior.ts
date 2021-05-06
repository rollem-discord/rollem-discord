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
 * Parses messages that mention the bot.
 */
@Injectable()
export class DiceTaggedBehavior extends DiceBehaviorBase {
  public label = 'dice-tagged';

  constructor(parsers: Parsers, config: Config, logger: Logger) { super(parsers, config, logger); }

  public async onTaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    let requireDice = false;
    var lines = this.rollMany(trigger, this.label, content, context, requireDice);
    return await this.makeReplyAndLog(trigger, this.label, lines);
  }

  public async onUntaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return null;
  }
}