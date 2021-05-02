import { Logger } from "@bot/logger";
import { Injectable, InjectionToken } from "injection-js";
import { BehaviorContext } from "./behavior-context";
import { BehaviorResponse } from "./behavior-response";

/** A Base Behavior. */
@Injectable()
export abstract class BehaviorBase {
  constructor(protected readonly logger: Logger) {
  }

  public abstract onUntaggedMessage(trigger: any, content: string, context: BehaviorContext): Promise<BehaviorResponse | null>;
  public abstract onTaggedMessage(trigger: any, content: string, context: BehaviorContext): Promise<BehaviorResponse | null>;
}
