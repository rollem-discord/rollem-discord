import { BehaviorContext } from "@common/behavior-context";
import { BehaviorResponse } from "@common/behavior-response";
import { BehaviorBase } from "@common/behavior.base";
import { Injectable } from "injection-js";

/** A ping-pong behavior for testing. */
@Injectable()
export class PingPongBehavior extends BehaviorBase {
  public async onTaggedMessage(content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    if (content.startsWith('ping')) {
      return {
        response: "pong",
      };
    } else {
      return null;
    }
  }

  public async onUntaggedMessage(content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return null;
  }
}