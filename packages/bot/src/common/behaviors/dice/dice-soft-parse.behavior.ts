import { Config } from "@bot/config";
import { Parsers } from "@bot/lib/parsers";
import { RollemRandomSources } from "@bot/lib/rollem-random-sources";
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

  constructor(parsers: Parsers, config: Config, rng: RollemRandomSources, logger: Logger) { super(parsers, config, rng, logger); }

  public async onPrefixMissing(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return null;
  }

  public async onDirectPing(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return null;
  }

  public async onPrefixProvidedOrNotRequired(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return this.onAllHandled(trigger, content, context);
  }

  private async onAllHandled(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    // apparently D8 is a common emote, so avoid responding to that
   if (content.startsWith('D')) { return null; }

   const requireDice = true;
   const lines = this.roll(content, this.label, content, context, requireDice);
   return await this.makeReplyAndLog(content, this.label, lines);
  }
}