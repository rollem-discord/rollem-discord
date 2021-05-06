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
 * Parses things with the following prefixes:
 *  - &
 *  - r
 */
@Injectable()
export class DiceShortPrefixedBehavior extends DiceBehaviorBase {
  public label = 'dice-short-prefix';

  constructor(parsers: Parsers, config: Config, logger: Logger) { super(parsers, config, logger); }

  public async onTaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return null;
  }

  public async onUntaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    // ignore the dice requirement with prefixed strings
    if (content.startsWith('r') || content.startsWith('&')) {
      let subMessage = content.substring(1);
      let requireDice = false;
      let lines = this.rollMany(trigger, `${this.label} (${content[0]})`, subMessage, context, requireDice);
      return await this.makeReplyAndLog(trigger, `${this.label} (${content[0]})`, lines);
    }

    return null;
  }
}