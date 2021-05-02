import { ChangeLog } from "@bot/changelog";
import { Logger } from "@bot/logger";
import { BehaviorContext } from "@common/behavior-context";
import { BehaviorResponse } from "@common/behavior-response";
import { BehaviorBase } from "@common/behavior.base";
import { Injectable } from "injection-js";

/** A ping-pong behavior for testing. */
@Injectable()
export class ChangelogBehavior extends BehaviorBase {
  constructor(
    private readonly changelog: ChangeLog,
    logger: Logger,
  ) {
    super(logger);
  }

  public async onTaggedMessage(trigger: any, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    if (content.startsWith('changelog') ||
      content.startsWith('change log') ||
      content.startsWith('changes') ||
      content.startsWith('diff')) {
      this.logger.trackMessageEvent("changelog", trigger);

      return {
        response: this.changelog.changelog,
      };
    } else {
      return null;
    }
  }

  public async onUntaggedMessage(trigger: any, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return null;
  }
}
