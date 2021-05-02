import { Injectable } from "injection-js";

export type BotStats = Record<string, string | undefined>;

@Injectable()
export abstract class BehaviorStatsBase {
  public abstract getStats(): Promise<BotStats>;
}