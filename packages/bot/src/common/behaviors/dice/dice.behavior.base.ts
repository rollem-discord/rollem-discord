import { Config } from "@bot/config";
import { Parsers } from "@bot/lib/parsers";
import { Logger, LoggerCategory } from "@bot/logger";
import { BehaviorContext, isKnownPrefix } from "@common/behavior-context";
import { BehaviorResponse } from "@common/behavior-response";
import { BehaviorBase, Trigger } from "@common/behavior.base";
import { ContainerV1 } from "@rollem/language";
import { Injectable } from "injection-js";
import _ from "lodash";

/** A ping-pong behavior for testing. */
@Injectable()
export abstract class DiceBehaviorBase extends BehaviorBase {
  constructor(
    protected readonly parsers: Parsers,
    protected readonly config: Config,
    logger: Logger,
  ) { super(logger); }

  /**
   * Attempts to roll many dice from the given content
   * @returns The response message(s) or null
   */
  protected rollMany(trigger: Trigger, logTag: string, content: string, context: BehaviorContext, requireDice: boolean): string[] | null {
    try {
      switch(context.roleConfiguredOptions.whichParser) {
        case 'v2': 
          return this.rollManyV2(trigger, logTag, content, context, requireDice);
        case 'v1-beta':
          return this.rollManyV1Beta(trigger, logTag, content, context, requireDice);
        case 'v1':
        default:
          return this.rollManyV1(trigger, logTag, content, context, requireDice);
      }
    } catch (ex) {
      this.logger.trackMessageError(LoggerCategory.BehaviorEvent, `Roll Many, ${logTag}: ${content}`, trigger);
      throw ex;
    }
  }

  protected rollManyV2(trigger: Trigger, logTag: string, content: string, context: BehaviorContext, requireDice: boolean): string[] | null {
    return ["the v2 parser is not yet ready"];
  }

  protected rollManyV1Beta(trigger: Trigger, logTag: string, content: string, context: BehaviorContext, requireDice: boolean): string[] | null {
    let count = 1;
    const match = content.match(/(?:(\d+)#\s*)?(.*)/);
    const countRaw = match ? match[1] : false;
    if (countRaw) {
      count = parseInt(countRaw, 10);
      if (count > 100) { return null; }
      if (count < 1) { return null; }
    }

    count = count || 1;
    const contentAfterCount = match ? match[2] : content;

    const lines: string[] = [];
    for (let i = 0; i < count; i++) {
      const result = this.parsers.v1beta.tryParse(contentAfterCount);
      if (!result) { return null; }

      const hasPrefix = isKnownPrefix(context.messageConfiguredOptions?.prefixStyle);
      const shouldReply = hasPrefix || (result.depth > 1 && result.dice > 0); // don't be too aggressive with the replies
      if (!shouldReply) { return null; }

      const response = this.buildMessage(result, requireDice);

      if (response && shouldReply) {
        lines.push(response);
      }
    }

    if (lines.length > 0) {
      this.logger.trackMessageEvent(LoggerCategory.BehaviorEvent, `Roll Many v1, ${logTag}: ${content}`, trigger);
    }

    return lines;
  }

  protected rollManyV1(trigger: Trigger, logTag: string, content: string, context: BehaviorContext, requireDice: boolean): string[] | null {
    let count = 1;
    const match = content.match(/(?:(\d+)#\s*)?(.*)/);
    const countRaw = match ? match[1] : false;
    if (countRaw) {
      count = parseInt(countRaw, 10);
      if (count > 100) { return null; }
      if (count < 1) { return null; }
    }

    count = count || 1;
    const contentAfterCount = match ? match[2] : content;

    const lines: string[] = [];
    for (let i = 0; i < count; i++) {
      const result = this.parsers.v1.tryParse(contentAfterCount);
      if (!result) { return null; }

      // don't be too aggressive with the replies
      const hasEnoughDice = requireDice ? result.dice > 0 : true;
      const hasPrefix = isKnownPrefix(context.messageConfiguredOptions?.prefixStyle);
      const shouldReply = hasPrefix || (result.depth > 1 && hasEnoughDice);
      if (!shouldReply) { return null; }

      const response = this.buildMessage(result, requireDice);

      if (response && shouldReply) {
        lines.push(response);
      }
    }

    if (lines.length > 0) {
      this.logger.trackMessageEvent(LoggerCategory.BehaviorEvent, `Roll Many v1, ${logTag}: ${content}`, trigger);
    }

    return lines;
  }

  // TODO: Handle response type of rollem parser
  protected buildMessage(result: ContainerV1 | false, requireDice = true) {
    if (result === false) { return false; }
    if (result.error) { return result.error; }
    if (result.depth <= 1) { return false; }
    if (requireDice && result.dice < 1) { return false; }

    let response = "";

    if (result.label && result.label !== "") {
      response += "'" + result.label + "', ";
    }
    if (typeof (result.value) === "boolean") {
      result.value = result.value ? "**Success!**" : "**Failure!**";
    }

    //spacing out along with a nice formatting of the role number. 
    response += '` ' + result.value + ' `' + ' ⟵ ' + result.pretties.split(']').join('] ');

    return response;
  }

  /** 
   * Produces a reply to the message.
   * @param logTag The tag for this log path.
   * @param lines The grouped replies, or null.
   * @returns True if a response was sent.
   */
  protected async makeReplyAndLog(trigger: Trigger, logTag: string, lines: string[] | null): Promise<BehaviorResponse | null> {
    if (lines && lines.length > 0) {

      const response = "\n" + lines.join("\n");

      return {
        response,
      };
    }

    return null;
  }
}