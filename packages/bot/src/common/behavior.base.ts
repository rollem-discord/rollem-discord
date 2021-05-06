import { Logger } from "@bot/logger";
import { Message } from "discord.js";
import { Injectable, InjectionToken } from "injection-js";
import { BehaviorContext } from "./behavior-context";
import { BehaviorResponse } from "./behavior-response";

/** The event that initiated this action. */
export type Trigger = Message | any;

/** A Base Behavior. */
@Injectable()
export abstract class BehaviorBase {
  constructor(protected readonly logger: Logger) {
  }

  /** The label for this behavior. Used in logging. */
  public abstract get label(): string;

  public abstract onUntaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null>;
  public abstract onTaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null>;
}
