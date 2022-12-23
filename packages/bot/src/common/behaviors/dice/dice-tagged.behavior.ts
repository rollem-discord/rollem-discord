import { Config } from "@bot/config";
import { Parsers } from "@bot/lib/parsers";
import { RollemRandomSources } from "@bot/lib/rollem-random-sources";
import { Logger } from "@bot/logger";
import { PromLogger, RollHandlerSubtype } from "@bot/prom-logger";
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
  public label = "dice-tagged";

  constructor(
    parsers: Parsers,
    config: Config,
    rng: RollemRandomSources,
    promLogger: PromLogger,
    logger: Logger
  ) {
    super(parsers, config, rng, promLogger, logger);
  }

  public async onPrefixMissing(
    trigger: Trigger,
    content: string,
    context: BehaviorContext
  ): Promise<BehaviorResponse | null> {
    return null;
  }

  public async onDirectPing(
    trigger: Trigger,
    content: string,
    context: BehaviorContext
  ): Promise<BehaviorResponse | null> {
    let requireDice = false;
    var lines = this.roll(trigger, this.label, content, context, requireDice);
    return await this.makeReplyAndLog(trigger, this.label, RollHandlerSubtype.Tagged, lines);
  }

  public async onPrefixProvidedOrNotRequired(
    trigger: Trigger,
    content: string,
    context: BehaviorContext
  ): Promise<BehaviorResponse | null> {
    return null;
  }
}