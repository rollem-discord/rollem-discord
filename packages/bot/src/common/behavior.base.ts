import { Injectable, InjectionToken } from "injection-js";
import { BehaviorContext } from "./behavior-context";
import { BehaviorResponse } from "./behavior-response";

/** A Base Behavior. */
@Injectable()
export abstract class BehaviorBase {
  public abstract onUntaggedMessage(content: string, context: BehaviorContext): Promise<BehaviorResponse | null>;
  public abstract onTaggedMessage(content: string, context: BehaviorContext): Promise<BehaviorResponse | null>;
}
