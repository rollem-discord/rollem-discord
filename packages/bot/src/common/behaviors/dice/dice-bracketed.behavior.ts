import { Config } from "@bot/config";
import { Parsers } from "@bot/lib/parsers";
import { Logger, LoggerCategory } from "@bot/logger";
import { BehaviorContext } from "@common/behavior-context";
import { BehaviorResponse } from "@common/behavior-response";
import { Trigger } from "@common/behavior.base";
import { Injectable } from "injection-js";
import _ from "lodash";
import { DiceBehaviorBase } from "./dice.behavior.base";

/**
 * Parses `[inline rolls]`
 */
@Injectable()
export class DiceBracketedBehavior extends DiceBehaviorBase {
  public label = 'dice-bracketed';

  constructor(parsers: Parsers, config: Config, logger: Logger) { super(parsers, config, logger); }

  public onTaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return this.onAll(trigger, content, context);
  }

  public async onUntaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return this.onAll(trigger, content, context);
  }

  private async onAll(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    // handle inline matches
    let last: RegExpExecArray | null = null;
    let matches: string[] = [];
    let regex = /\[(.+?)\]/g;
    while (last = regex.exec(content)) { matches.push(last[1]); }

    if (matches && matches.length > 0) {
      this.logger.trackMessageEvent(LoggerCategory.BehaviorEvent, `${this.label} (parent): [${matches.join('], [')}]`, trigger);
      let lines =
        _(matches)
          .map(match => {
            let hasPrefix = true;
            let requireDice = true;
            let lines = this.rollMany(trigger, this.label, match, context, requireDice);
            return lines;
          })
          .filter(x => x != null)
          .map(x => x || [])
          .flatten()
          .value();

      if (lines.length === 0) { return null; }
      return await this.makeReplyAndLog(trigger, this.label, lines);
    }

    return null;
  }
}